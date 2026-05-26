/**
 * FirestoreDebugPage — temporary diagnostic tool
 * Navigate to this page to see exactly what Firestore returns in the browser
 */
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

const FirestoreDebugPage: React.FC = () => {
    const [leads, setLeads] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [log, setLog] = useState<string[]>([]);

    const addLog = (msg: string) => setLog(prev => [...prev, `${new Date().toLocaleTimeString()} — ${msg}`]);

    useEffect(() => {
        addLog('Starting Firestore connection...');
        addLog(`Project ID from env: ${import.meta.env.VITE_FIREBASE_PROJECT_ID}`);

        // Direct getDocs test
        getDocs(collection(db, 'leads')).then(snap => {
            addLog(`✅ getDocs leads: ${snap.size} documents`);
        }).catch(e => {
            addLog(`❌ getDocs leads FAILED: ${e.code} — ${e.message}`);
            setErrors(prev => [...prev, e.message]);
        });

        getDocs(collection(db, 'projects')).then(snap => {
            addLog(`✅ getDocs projects: ${snap.size} documents`);
        }).catch(e => {
            addLog(`❌ getDocs projects FAILED: ${e.code} — ${e.message}`);
            setErrors(prev => [...prev, e.message]);
        });

        // onSnapshot test for leads
        const unsubLeads = onSnapshot(
            collection(db, 'leads'),
            (snap) => {
                addLog(`📡 onSnapshot leads: ${snap.size} docs`);
                setLeads(snap.docs.slice(0, 5).map(d => ({ id: d.id, ...d.data() })));
                setLoading(false);
            },
            (err) => {
                addLog(`❌ onSnapshot leads ERROR: ${err.code} — ${err.message}`);
                setErrors(prev => [...prev, `leads: ${err.message}`]);
                setLoading(false);
            }
        );

        // onSnapshot test for projects
        const unsubProjects = onSnapshot(
            collection(db, 'projects'),
            (snap) => {
                addLog(`📡 onSnapshot projects: ${snap.size} docs`);
                setProjects(snap.docs.slice(0, 5).map(d => ({ id: d.id, ...d.data() })));
            },
            (err) => {
                addLog(`❌ onSnapshot projects ERROR: ${err.code} — ${err.message}`);
                setErrors(prev => [...prev, `projects: ${err.message}`]);
            }
        );

        return () => { unsubLeads(); unsubProjects(); };
    }, []);

    return (
        <div style={{ padding: 24, background: '#0a0a0a', minHeight: '100vh', fontFamily: 'monospace', color: '#fff' }}>
            <h1 style={{ color: '#ec028b', fontSize: 20, marginBottom: 16 }}>🔥 Firestore Debug Page</h1>

            {/* Config */}
            <div style={{ background: '#111', border: '1px solid #333', borderRadius: 8, padding: 16, marginBottom: 16 }}>
                <p style={{ color: '#888', fontSize: 11, textTransform: 'uppercase', marginBottom: 8 }}>Firebase Config</p>
                <p>Project ID: <strong style={{ color: '#4ade80' }}>{import.meta.env.VITE_FIREBASE_PROJECT_ID || '⚠️ EMPTY'}</strong></p>
                <p>Auth Domain: <strong style={{ color: '#60a5fa' }}>{import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '⚠️ EMPTY'}</strong></p>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 8, padding: 16, marginBottom: 16 }}>
                    <p style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: 8 }}>❌ ERRORS:</p>
                    {errors.map((e, i) => <p key={i} style={{ color: '#fca5a5', fontSize: 13 }}>{e}</p>)}
                </div>
            )}

            {/* Log */}
            <div style={{ background: '#111', border: '1px solid #333', borderRadius: 8, padding: 16, marginBottom: 16 }}>
                <p style={{ color: '#888', fontSize: 11, textTransform: 'uppercase', marginBottom: 8 }}>Activity Log</p>
                {log.map((l, i) => <p key={i} style={{ fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>{l}</p>)}
                {loading && <p style={{ color: '#eab308', fontSize: 12 }}>⏳ Waiting for data...</p>}
            </div>

            {/* Results */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ background: '#111', border: '1px solid #333', borderRadius: 8, padding: 16 }}>
                    <p style={{ color: '#888', fontSize: 11, textTransform: 'uppercase', marginBottom: 8 }}>
                        Leads ({leads.length} of total)
                    </p>
                    {leads.length === 0 && !loading && <p style={{ color: '#ef4444' }}>No leads returned</p>}
                    {leads.map((l, i) => (
                        <div key={i} style={{ borderBottom: '1px solid #222', paddingBottom: 8, marginBottom: 8 }}>
                            <p style={{ color: '#fff', fontSize: 13 }}>{l.name || l.first_name + ' ' + l.last_name || 'No name'}</p>
                            <p style={{ color: '#6b7280', fontSize: 11 }}>stage: {l.current_stage} | id: {l.id?.slice(-8)}</p>
                        </div>
                    ))}
                </div>
                <div style={{ background: '#111', border: '1px solid #333', borderRadius: 8, padding: 16 }}>
                    <p style={{ color: '#888', fontSize: 11, textTransform: 'uppercase', marginBottom: 8 }}>
                        Projects ({projects.length} of total)
                    </p>
                    {projects.length === 0 && !loading && <p style={{ color: '#6b7280' }}>No projects (empty collection)</p>}
                    {projects.map((p, i) => (
                        <div key={i} style={{ borderBottom: '1px solid #222', paddingBottom: 8, marginBottom: 8 }}>
                            <p style={{ color: '#fff', fontSize: 13 }}>{p.name || 'No name'}</p>
                            <p style={{ color: '#6b7280', fontSize: 11 }}>stage: {p.current_stage} | id: {p.id?.slice(-8)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FirestoreDebugPage;
