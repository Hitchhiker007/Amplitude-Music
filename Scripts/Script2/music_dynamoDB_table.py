import boto3
import json

dynamodb = boto3.client('dynamodb')

# Task 1.2
table_name = 'music'
key_schema = [
    {
        'AttributeName': 'title',
        'KeyType': 'HASH'  
    }
]
attribute_definitions = [
    {
        'AttributeName': 'title',
        'AttributeType': 'S'  
    }
]
provisioned_throughput = {
    'ReadCapacityUnits': 20,
    'WriteCapacityUnits': 20
}

# create the table

response = dynamodb.create_table(
    TableName=table_name,
    KeySchema=key_schema,
    AttributeDefinitions=attribute_definitions,
    ProvisionedThroughput=provisioned_throughput
)
print("Creating Table!")
print("Give me a moment!")


# wait for the table to become active
waiter = dynamodb.get_waiter('table_exists')
waiter.wait(TableName=table_name)
print("THE TABLE IS NOW READY!")

# load data
with open('a1.json') as json_file:
    data = json.load(json_file)

# get the songs from the JSON data
songs = data.get('songs', [])

dynamodb_resource = boto3.resource('dynamodb')
table = dynamodb_resource.Table(table_name)

# add songs to the table
for song in songs:
    table.put_item(Item=song)
    print(f"Added song: {song['title']}") 
    

print("Songs added to the table successfully!")
