import React, { useState } from 'react';
import { store } from './store';

const Input = (props) => (<input className="input" {...props} />);

export default function Profile() {
	const [me, setMe] = useState(() => store.get('me', { name: 'Admin', email: 'admin@example.com' }));
	const save = () => { store.set('me', me); alert('Profile saved (client-side demo).'); };
	return (
		<div className="page">
			<div className="card"><div className="card-title">My Profile</div>
				<div className="form">
					<div className="form-row"><label>Name</label><Input value={me.name} onChange={e=>setMe(s=>({...s,name:e.target.value}))} /></div>
					<div className="form-row"><label>Email</label><Input value={me.email} onChange={e=>setMe(s=>({...s,email:e.target.value}))} /></div>
					<div className="form-row"><button className="btn btn--primary" onClick={save}>Save</button></div>
				</div>
			</div>
		</div>
	);
}
