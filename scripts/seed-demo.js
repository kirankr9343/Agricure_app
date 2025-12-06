const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const keyPath = path.join(__dirname, '..', 'firebase-admin-sdk.json.json');
const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();
const auth = admin.auth();

async function seed() {
  console.log('Seeding demo data...');

  // Create admin user
  let uid;
  try {
    const user = await auth.createUser({
      email: 'admin@example.com',
      password: 'Admin123!',
      displayName: 'Super Admin'
    });
    uid = user.uid;
    console.log('Created auth user', uid);
  } catch (e) {
    console.warn('Could not create user (maybe exists). Continuing. Error:', e.message);
  }

  // Ensure users collection document
  if (uid) {
    await db.collection('users').doc(uid).set({
      displayName: 'Super Admin',
      email: 'admin@example.com',
      role: 'superAdmin'
    }, { merge: true });
  }

  // Sample farmers
  const farmers = [
    { name: 'Ravi Kumar', phone: '9876543210', district: 'Pune', state: 'Maharashtra', mainCrop: 'Wheat', farmSize: '2 acres', language: 'hi', soilType: 'loam', irrigationType: 'drip', lastActive: admin.firestore.FieldValue.serverTimestamp(), status: 'active' },
    { name: 'Sita Devi', phone: '9123456780', district: 'Varanasi', state: 'Uttar Pradesh', mainCrop: 'Rice', farmSize: '1.5 acres', language: 'hi', soilType: 'clay', irrigationType: 'flood', lastActive: admin.firestore.FieldValue.serverTimestamp(), status: 'active' }
  ];

  for (const f of farmers) {
    await db.collection('farmers').add(f);
  }

  // Sample vendors
  const vendors = [
    { name: 'Agri Supplies', type: 'inputVendor', district: 'Pune', phone: '9998887777', email: 'vendor@example.com', rating: 4.5, status: 'approved', verified: true },
  ];
  for (const v of vendors) await db.collection('vendors').add(v);

  // Sample product
  await db.collection('products').add({ name: 'Super Seed', category: 'seeds', crop: 'Wheat', description: 'High yield seeds', imageUrl: '', price: 200, mrp: 250, stock: 100, vendorId: null, tags: ['high-yield'], status: 'active' });

  // Sample order
  await db.collection('orders').add({ orderId: 'ORD-1001', farmerId: null, items: [], totalAmount: 1500, paymentStatus: 'paid', orderStatus: 'pending', createdAt: admin.firestore.FieldValue.serverTimestamp() });

  console.log('Seeding complete');
}

seed().catch((err) => { console.error(err); process.exit(1); });
