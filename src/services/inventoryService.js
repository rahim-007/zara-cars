import { CARS } from '../data/cars'
import { isFirebaseConfigured, db, storage } from './firebase'
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const STORAGE_KEY = 'zara_cars_inventory_v2'
const INVENTORY_EVENT = 'zara_inventory_updated'

// Helper to sanitize and prepare initial cars data
function getInitialCars() {
  return CARS.map((car, index) => ({
    ...car,
    status: car.status || (index === 4 ? 'sold' : 'available'), // Make one sold for demo variety if needed
    brand: car.brand || car.name.split(' ')[0],
    model: car.model || car.name.split(' ').slice(1).join(' '),
    createdAt: car.createdAt || new Date(Date.now() - (index * 86400000)).toISOString(),
    updatedAt: car.updatedAt || new Date().toISOString(),
  }))
}

// Local storage helpers
function getLocalInventory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const initial = getInitialCars()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
      return initial
    }
    return JSON.parse(raw)
  } catch (err) {
    console.error('Error reading inventory from localStorage:', err)
    return getInitialCars()
  }
}

function saveLocalInventory(cars) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cars))
    window.dispatchEvent(new CustomEvent(INVENTORY_EVENT, { detail: cars }))
  } catch (err) {
    console.error('Error writing inventory to localStorage:', err)
  }
}

export const inventoryService = {
  isConfigured: isFirebaseConfigured,

  // Subscribe to real-time inventory updates
  subscribe(callback) {
    if (isFirebaseConfigured && db) {
      const q = query(collection(db, 'cars'), orderBy('createdAt', 'desc'))
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const vehicles = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
          callback(vehicles)
        },
        (error) => {
          console.error('Firestore subscription error, falling back to local:', error)
          callback(getLocalInventory())
        }
      )
      return unsubscribe
    }

    // LocalStorage mode subscription
    const handleLocalUpdate = (e) => {
      callback(e.detail || getLocalInventory())
    }
    window.addEventListener(INVENTORY_EVENT, handleLocalUpdate)
    window.addEventListener('storage', handleLocalUpdate)
    
    // Initial emission
    callback(getLocalInventory())

    return () => {
      window.removeEventListener(INVENTORY_EVENT, handleLocalUpdate)
      window.removeEventListener('storage', handleLocalUpdate)
    }
  },

  // Fetch all vehicles
  async getVehicles() {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'cars'), orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(q)
        if (!snapshot.empty) {
          return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
        }
        // If Firestore is empty, seed with initial demo inventory
        const initial = getInitialCars()
        for (const item of initial) {
          const { id, ...data } = item
          await addDoc(collection(db, 'cars'), {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          })
        }
        const refreshedSnapshot = await getDocs(q)
        return refreshedSnapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      } catch (err) {
        console.warn('Firestore fetch failed, using local storage demo:', err)
      }
    }
    return getLocalInventory()
  },

  // Get single vehicle by ID
  async getVehicleById(id) {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'cars', id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() }
        }
      } catch (err) {
        console.warn('Firestore getDoc failed, falling back to local:', err)
      }
    }
    const localCars = getLocalInventory()
    return localCars.find(c => String(c.id) === String(id)) || null
  },

  // Add new vehicle
  async addVehicle(vehicleData) {
    const defaultData = {
      name: 'Zara Certified Vehicle',
      brand: 'Zara',
      model: 'Series',
      year: new Date().getFullYear(),
      category: 'suv',
      status: 'available',
      price: '₹ 15.00 L',
      priceNumber: 15.00,
      priceSub: 'Best Price Assured',
      originalPrice: '₹ 20.00 L (New)',
      savings: 'Save ₹ 5.00 Lakhs',
      budget: 'under-15',
      budgetLabel: 'Under ₹15 Lakhs',
      tag: 'Certified Pre-Owned',
      badge: '140-PT CERTIFIED',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80&fit=crop',
      gallery: [],
      km: '10,000 KM',
      fuel: 'Petrol · Automatic',
      owner: '1st Owner',
      rto: 'TN-21 (Kanchipuram)',
      insurance: 'Comprehensive Active',
      color: 'Monochrome Silver',
      warranty: '1 Year Warranty Included',
      desc: 'Certified luxury automobile inspected across 140 mechanical and electronic checkpoints.',
      highlights: ['Full Service Record', 'Touchscreen Infotainment', 'Alloy Wheels'],
      specs: [
        { label: 'Odometer', value: '10,000 KM' },
        { label: 'Registration', value: 'TN-21 Kanchipuram' },
        { label: 'Ownership', value: '1st Owner' },
      ],
      checks: [
        { category: 'Engine & Transmission', status: 'Passed', detail: 'Scan 0 Errors, Compression Normal' },
        { category: 'Chassis & Structural Frame', status: 'Certified', detail: '100% Non-Accidental OEM Integrity' },
        { category: 'Flood Free Integrity', status: 'Verified', detail: 'Zero Water Intrusion or Moisture' },
        { category: 'Cabin AC & Electronics', status: 'Tested', detail: 'All Electronics & Chiller AC OK' },
        { category: 'Legal Clearance', status: 'Cleared', detail: 'Clear Title, Zero Challans, Free RC Transfer' },
      ],
      ...vehicleData,
    }

    if (isFirebaseConfigured && db) {
      try {
        const docRef = await addDoc(collection(db, 'cars'), {
          ...defaultData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
        return { id: docRef.id, ...defaultData }
      } catch (err) {
        console.warn('Firestore addDoc failed, storing locally:', err)
      }
    }

    const localCars = getLocalInventory()
    const newCar = {
      ...defaultData,
      id: vehicleData.id || `zara-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const updated = [newCar, ...localCars]
    saveLocalInventory(updated)
    return newCar
  },

  // Update existing vehicle
  async updateVehicle(id, updateData) {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'cars', id)
        await updateDoc(docRef, {
          ...updateData,
          updatedAt: serverTimestamp(),
        })
        return { id, ...updateData }
      } catch (err) {
        console.warn('Firestore updateDoc failed, updating locally:', err)
      }
    }

    const localCars = getLocalInventory()
    const index = localCars.findIndex(c => String(c.id) === String(id))
    if (index !== -1) {
      const updatedItem = {
        ...localCars[index],
        ...updateData,
        updatedAt: new Date().toISOString(),
      }
      localCars[index] = updatedItem
      saveLocalInventory([...localCars])
      return updatedItem
    }
    throw new Error(`Vehicle with ID ${id} not found`)
  },

  // Toggle available / sold status
  async toggleVehicleStatus(id) {
    const current = await this.getVehicleById(id)
    if (!current) throw new Error('Vehicle not found')
    const newStatus = current.status === 'sold' ? 'available' : 'sold'
    return this.updateVehicle(id, { status: newStatus })
  },

  // Delete vehicle
  async deleteVehicle(id) {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'cars', id)
        await deleteDoc(docRef)
        return true
      } catch (err) {
        console.warn('Firestore deleteDoc failed, removing locally:', err)
      }
    }

    const localCars = getLocalInventory()
    const filtered = localCars.filter(c => String(c.id) !== String(id))
    saveLocalInventory(filtered)
    return true
  },

  // Upload vehicle image
  async uploadImage(file) {
    if (isFirebaseConfigured && storage) {
      try {
        const filename = `cars/${Date.now()}-${file.name.replace(/\s+/g, '_')}`
        const storageRef = ref(storage, filename)
        const snapshot = await uploadBytes(storageRef, file)
        const downloadURL = await getDownloadURL(snapshot.ref)
        return downloadURL
      } catch (err) {
        console.warn('Firebase Storage upload failed, converting to DataURL:', err)
      }
    }

    // Demo Mode fallback: Convert file to Base64 Data URL so it previews and saves in local state
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = (e) => reject(e)
      reader.readAsDataURL(file)
    })
  },

  // Reset to initial demo fleet
  resetDemoData() {
    const initial = getInitialCars()
    saveLocalInventory(initial)
    return initial
  }
}
