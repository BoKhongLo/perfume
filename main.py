from typing import List
from fastapi import FastAPI, File, Form, UploadFile, HTTPException, Request
from fastapi.responses import StreamingResponse
import pandas as pd
import xmltodict
import json
from io import StringIO  

app = FastAPI()

def extract_user_info(user: dict): 
    id = user['id'] if 'id' in user else ''
    email = user['email'] if 'email' in user else ''
    secretKey = user['secretKey'] if 'secretKey' in user else ''
    username = user['username'] if 'username' in user else ''
    firstName = user["details"]["firstName"] if isinstance(user.get("details"), dict) and "firstName" in user["details"] else ""
    lastName = user["details"]["lastName"] if isinstance(user.get("details"), dict) and "lastName" in user["details"] else ""
    phoneNumber = user["details"]["phoneNumber"] if isinstance(user.get("details"), dict) and "phoneNumber" in user["details"] else 0
    birthday = user["details"]["birthday"] if isinstance(user.get("details"), dict) and "birthday" in user["details"] else ""
    address = user["details"]["address"] if isinstance(user.get("details"), dict) and "address" in user["details"] else ""
    gender = user["details"]["gender"] if isinstance(user.get("details"), dict) and "gender" in user["details"] else ""
    imgDisplay = user["details"]["imgDisplay"] if isinstance(user.get("details"), dict) and "imgDisplay" in user["details"] else ""
    role = ", ".join([s for s in user["role"]]) if "role" in user else ""

    return {
        'id': id,
        'email': email,
        'secretKey': secretKey,
        'username': username,
        'role': role,
        'firstName' : firstName,
        'lastName' : lastName,
        'phoneNumber': phoneNumber,
        'birthday': birthday,
        'address': address,
        'gender': gender,
        'imgDisplay': imgDisplay,
        "created_at": user["created_at"] if "created_at" in user else '',
        "updated_at": user["updated_at"] if "updated_at" in user else '',
    }


def extract_order_info(order: dict):

    id = order['id'] if 'id' in order else ''
    isPaid = order['isPaid'] if 'isPaid' in order else False
    totalAmount = order['totalAmount'] if 'totalAmount' in order else 0
    status = order['status'] if 'status' in order else ''
    notes = order['notes'] if 'notes' in order else ''
    city = order["deliveryInfo"]["city"] if isinstance(order.get("deliveryInfo"), dict) and "city" in order["deliveryInfo"] else ""
    district = order["deliveryInfo"]["district"] if isinstance(order.get("deliveryInfo"), dict) and "district" in order["deliveryInfo"] else ""
    address = order["deliveryInfo"]["address"] if isinstance(order.get("deliveryInfo"), dict) and "address" in order["deliveryInfo"] else ""
    email = order["customerInfo"]["email"] if isinstance(order.get("customerInfo"), dict) and "email" in order["customerInfo"] else ""
    firstName = order["customerInfo"]["firstName"] if isinstance(order.get("customerInfo"), dict) and "firstName" in order["customerInfo"] else ""
    lastName = order["customerInfo"]["lastName"] if isinstance(order.get("customerInfo"), dict) and "lastName" in order["customerInfo"] else ""
    phoneNumber = order["customerInfo"]["phoneNumber"] if isinstance(order.get("customerInfo"), dict) and "phoneNumber" in order["customerInfo"] else ""
    orderProducts = order['orderProducts'] if 'orderProducts' in order else []


    productIds = []
    unitPrices = []
    quantities = []
    discounts = []

    for product in orderProducts:
        productIds.append(str(product['productId']) if 'productId' in product else '')
        unitPrices.append(str(product['unitPrice']) if 'unitPrice' in product else '')
        quantities.append(str(product['quantity']) if 'quantity' in product else '')
        discounts.append(str(product['discount']) if 'discount' in product else '')  
        

    productIds_str = ', '.join(productIds)
    unitPrices_str = ', '.join(productIds)
    quantities_str = ', '.join(quantities)
    discounts_str = ', '.join(discounts)

    return {
        'id': id,
        'isPaid': isPaid,
        'totalAmount': totalAmount,
        'status': status,
        'notes': notes,
        'city' : city,
        'district': district,
        'address' : address,
        'email' : email,
        'firstName' : firstName,
        'lastName' : lastName,
        'phoneNumber': phoneNumber,
        'productId' : productIds_str,
        'unitPrice' : unitPrices_str,
        'quantity' : quantities_str,
        'discount' : discounts_str,
        "created_at": order["created_at"] if "created_at" in order else '',
        "updated_at": order["updated_at"] if "updated_at" in order else '',
    }

def extract_product_info(product: dict):
    details = product["details"] if "details" in product else {}

    brand = details["brand"]["value"] if isinstance(details.get("brand"), dict) and "value" in details["brand"] else ""
    size = ", ".join([s["value"] for s in details["size"] if isinstance(s, dict) and "value" in s]) if "size" in details else ""
    sillage = details["sillage"]["value"] if isinstance(details.get("sillage"), dict) and "value" in details["sillage"] else ""
    longevity = details["longevity"]["value"] if isinstance(details.get("longevity"), dict) and "value" in details["longevity"] else ""
    fragranceNotes = details["fragranceNotes"]["value"] if isinstance(details.get("fragranceNotes"), dict) and "value" in details["fragranceNotes"] else ""
    concentration = details["concentration"]["value"] if isinstance(details.get("concentration"), dict) and "value" in details["concentration"] else ""
    sex = details["sex"]["value"] if isinstance(details.get("sex"), dict) and "value" in details["sex"] else ""
    description = details["description"] if "description" in details else ""
    tutorial = details["tutorial"] if "tutorial" in details else ""

    return {
        "id": product["id"] if "id" in product else '',
        "name": product["name"] if "name" in product else '',
        "originCost": product["originCost"] if "originCost" in product else 0,
        "displayCost": product["displayCost"] if "displayCost" in product else 0,
        "stockQuantity": product["stockQuantity"] if "stockQuantity" in product else 0,
        "category": product["category"] if "category" in product else '',
        "brand": brand,
        "size": size,
        "sillage": sillage,
        "longevity": longevity,
        "fragranceNotes": fragranceNotes,
        "concentration": concentration,
        "sex": sex,
        "description": description,
        "tutorial": tutorial,
        "rating": product["rating"] if "rating" in product else 0,
        "buyCount": product["buyCount"] if "buyCount" in product else 0,
        "created_at": product["created_at"] if "created_at" in product else '',
        "updated_at": product["updated_at"] if "updated_at" in product else '',
    }

def clean_and_split(text: str) -> List[str]:
    return [item.strip() for item in text.split(',') if item.strip()]

@app.post("/export-file")
async def export_csv(request: Request):
    try:
        rq = await request.json()
        data = rq['data']
        typeRq = rq['type']
        flat_data = []

        if typeRq == 'ReportUser': 
            flat_data = [extract_user_info(product) for product in data]
        elif typeRq == 'ReportOrder':
            flat_data = [extract_order_info(product) for product in data]
        elif typeRq == 'ReportProduct':
            flat_data = [extract_product_info(product) for product in data]

        df = pd.DataFrame(flat_data)

        csv_buffer = StringIO()
        df.to_csv(csv_buffer, index=False)
        csv_buffer.seek(0)


        response = StreamingResponse(csv_buffer, media_type="text/csv")
        response.headers["Content-Disposition"] = "attachment; filename=report.csv"
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
   
@app.post("/read-file")
async def analyze_file(file: UploadFile = File(...), typeFile = Form(...)):
    try:
        if file.filename.endswith(".csv"):
            df = pd.read_csv(file.file)
        elif file.filename.endswith(".xlsx") or file.filename.endswith(".xls"):
            df = pd.read_excel(file.file)
        elif file.filename.endswith(".xml"):
            file_content = file.file.read()
            xml_dict = xmltodict.parse(file_content)
            data = xml_dict['root']['product']
            df = pd.DataFrame(data)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")
        dataType = json.loads(typeFile)

        df.fillna('', inplace=True)
        if dataType['type'] == "CreateProduct":

            products = []
            for _, row in df.iterrows():
                product_json = {
                    "name": row['name'],
                    'originCost' : row['originCost'], 
                    'displayCost' : row['displayCost'], 
                    'stockQuantity' :row['stockQuantity'], 
                    "category": row['category'],
                    "details": {
                        "brand": {
                            "type": "brand",
                            "value": row['brand']
                        },
                        "size": [{"type": "size", "value": size.strip()} for size in row['size'].split(',')],
                        "sillage": {"type": "sillage", "value": row['sillage']},
                        "longevity": {"type": "longevity", "value": row['longevity']},
                        "fragranceNotes": {"type": "fragranceNotes", "value": row['fragranceNotes']},
                        "concentration": {"type": "concentration", "value": row['concentration']},
                        "sex": {"type": "sex", "value": row['sex']},
                        "description": row['description'],
                        "tutorial": row['tutorial']
                    }
                }

                products.append(product_json)
            return products

        elif dataType['type'] == "CreateUser":
            users = []
            for _, row in df.iterrows():
                user_json = {
                    "email": row['email'],
                    "username": row['username'],
                    "password": row['password'],
                    "firstName": row['firstName'],
                    "lastName": row['lastName'],
                    "role": [row['role']],
                    "phoneNumber": [row['phoneNumber']],
                    "birthday": row['birthday'],
                    "address": row['address'],
                    "gender": row['gender']
                }
                users.append(user_json)
            return users
        elif dataType['type'] == "CreateOrder":
            orders = []
            for _, row in df.iterrows():
                productId = clean_and_split(row['productId'])
                quantity = clean_and_split(row['quantity'])
                discounts = clean_and_split(row['discount'])

                order_products = [
                    {
                        "productId": int(pid),
                        "quantity": int(qty),
                        "discount": float(discount) if discount else 0
                    }
                    for pid, qty, discount in zip(productId, quantity, discounts)
                ]

                order_json = {
                    "orderProducts": order_products,
                    "deliveryInfo": {
                        "city": row.get('city', ''),
                        "district": row.get('district', ''),
                        "address": row.get('address', ''),
                    },
                    "customerInfo": {
                        "email": row.get('email', ''),
                        "firstName": row.get('firstName', ''),
                        "lastName": row.get('lastName', ''),
                        "phoneNumber": row.get('phoneNumber', ''),
                    },
                    "status": row.get('status', ''),
                    "notes": row.get('notes', ''),
                }
                orders.append(order_json)
            return orders
        elif dataType['type'] == "UpdateWarehouse":
            warehouse = []
            for _, row in df.iterrows():
                user_json = {
                    "id": int(row['id']), 
                    "count": int(row['count']) 
                }
                warehouse.append(user_json)
            return warehouse

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
