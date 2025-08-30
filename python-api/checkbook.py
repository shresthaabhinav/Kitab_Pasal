from pymongo import MongoClient

# Connect to local MongoDB
client = MongoClient("mongodb://localhost:27017/")

# Select the 'test' database
db = client["test"]

# Select the 'order' collection
orders = list(db["books"].find({}))

# Print all documents in 'order'
print("Documents in 'books' collection:")
if not orders:
    print("  (empty)")
else:
    for order in orders:
        print(order)
