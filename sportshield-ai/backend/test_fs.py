import os
import sys

# Add the current directory to sys.path to allow importing config
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config.firebase import get_firestore, init_firebase
from firebase_admin import firestore

init_firebase()
db = get_firestore()
try:
    query = db.collection('violations')
    query = query.where('detection_type', '==', 'deepfake')
    docs = query.order_by('detected_at', direction=firestore.Query.DESCENDING).limit(50).stream()
    for d in docs:
        print(d.id)
except Exception as e:
    import traceback
    traceback.print_exc()
