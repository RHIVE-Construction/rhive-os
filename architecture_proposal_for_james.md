# Architectural Proposal: Offline Address Caching & Sync Layer
**Prepared For:** James (Lead Backend Developer)  
**Target Integration:** RHIVE OS Address Validation & Intake Pipeline (E-02a)

---

## 1. System Overview
To minimize external Google Places/Geocoding API transaction billing and ensure field reps can operate seamlessly in offline or low-connectivity zones, this document outlines a local-first caching and synchronisation design. 

```
                                      +-------------------------+
                                      |   Client UI Layer       |
                                      +------------+------------+
                                                   |
                                 Cache Hit?        | (Get / Set)
                               +-------------------+------------------+
                               |                                      |
                               v                                      v
                  +------------+------------+            +------------+------------+
                  |  IndexedDB Local Cache  |            | Google Geocoding API   |
                  +-------------------------+            +------------+------------+
                                                                      | (Success)
                                                                      v
                                                         +------------+------------+
                                                         |  IndexedDB Local Cache  |
                                                         +-------------------------+
```

---

## 2. Client-Side Database Schema (IndexedDB)
The local client storage uses IndexedDB (via a library like `idb` or raw API) to manage two primary object stores:

### 2.1. Object Store: `address_cache`
Caches geocoded address payloads to prevent duplicate API lookups.
- **Key Path:** `address_hash` (SHA-256 hash of lowercase trimmed address string)
- **Indexes:** `timestamp` (for TTL eviction policies)
- **Record Schema:**
```typescript
interface AddressCacheRecord {
  address_hash: string;       // Primary Key
  raw_query: string;          // Original text searched
  formatted_address: string;  // Standardized Google format
  city: string;
  state: string;
  zip: string;
  latitude: number;
  longitude: number;
  street_view_heading: number;
  created_at: number;         // Epoc timestamp
}
```

### 2.2. Object Store: `offline_queue`
Buffers property intake submissions created while offline.
- **Key Path:** `temp_id` (UUID generated on client)
- **Indexes:** `status` (queued, syncing, failed)
- **Record Schema:**
```typescript
interface OfflineQueueRecord {
  temp_id: string;            // Primary Key
  payload_type: 'property' | 'project' | 'contact';
  payload: Record<string, any>; // Entity-specific creation state
  created_at: number;
  sync_attempts: number;
  last_error?: string;
  status: 'queued' | 'syncing' | 'failed';
}
```

---

## 3. Remote Synchronization Schema (Firestore)
Firestore must match client-side tracking, incorporating strict safety and soft-delete parameters.

### 3.1. Document Schema: `properties`
```typescript
interface PropertyDocument {
  id: string;
  address_full: string;
  city: string;
  state: string;
  zip: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  owner_id: string;
  isDeleted: boolean;         // Soft Delete flag (CRITICAL: Do not hard delete)
  updated_at: string;         // ISO-8601 server timestamp
  created_at: string;         // ISO-8601 server timestamp
  source: 'offline_sync' | 'online_direct';
}
```

---

## 4. Conflict Reconciliation Pipeline
Once connectivity changes from offline to online (`window.addEventListener('online')` or manual trigger), the client-side synchronization agent must execute the following reconciliation logic:

```
                      +-----------------------------+
                      |   Offline Queue Triggered   |
                      +--------------+--------------+
                                     |
                                     v
                        [Read Object Store: queue]
                                     |
                                     v
                        Are records present in Queue?
                                   /   \
                             Yes  /     \ No (End)
                                 v       v
                     +-----------+-----------+
                     | Process Row (1-by-1)  |
                     +-----------+-----------+
                                 |
                                 v
                       Check Collision: Does the
                       property address already
                       exist in Firestore?
                                 / \
                           Yes  /   \ No
                               v     v
             +-----------------+     +-----------------+
             | Merge & Patch   |     | Insert Document |
             | (Soft Update)   |     +-----------------+
             +--------+--------+              |
                      |                       |
                      +-----------+-----------+
                                  |
                                  v
                       Remove Row from Queue
```

### 4.1. Duplication & Collision Rule
Before writing an offline property document:
1. Query Firestore for an active (`isDeleted: false`) record matching the target address.
2. If a matching record is found:
   - Perform a partial update (`PATCH` logic via `.update()`) to merge telemetry (e.g. pinned building coordinates).
   - Do **NOT** call `.set()`.
3. If no matching record is found:
   - Create a new document with server-generated metadata.

---

## 5. Front-End Hook Integration Points
To decouple UI states from backend caching logic, the client intake pages communicate with the caching layers via unified async interfaces. James can swap out these stubs for the active IndexedDB adapter:

```typescript
/**
 * Resolves geolocation for a given search query.
 * Checks local cache first; falls back to API on miss.
 */
export async function resolveAddress(
  query: string, 
  apiGeocode: (q: string) => Promise<AddressData>
): Promise<AddressData> {
  const hash = generateHash(query);
  const cached = await localDB.get('address_cache', hash);
  if (cached) {
    return cached;
  }
  const result = await apiGeocode(query);
  await localDB.put('address_cache', { ...result, address_hash: hash });
  return result;
}

/**
 * Enqueues a new record for synchronization.
 */
export async function enqueueIntake(
  type: 'property' | 'project', 
  payload: any
): Promise<void> {
  if (navigator.onLine) {
    await sendToFirestore(type, payload);
  } else {
    await localDB.add('offline_queue', {
      temp_id: uuid(),
      payload_type: type,
      payload,
      status: 'queued',
      created_at: Date.now(),
      sync_attempts: 0
    });
  }
}
```
