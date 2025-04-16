import boto3

# start dynamodb client
dynamodb = boto3.client('dynamodb')

# define
table_name = 'login'
key_schema = [
    {
        'AttributeName': 'email',
        'KeyType': 'HASH'  
    }
]
attribute_definitions = [
    {
        'AttributeName': 'email',
        'AttributeType': 'S'  
    }
]
# make the script faster!
provisioned_throughput = {
    'ReadCapacityUnits': 20,
    'WriteCapacityUnits': 20
}

# create the table
try:
    dynamodb.create_table(
        TableName=table_name,
        KeySchema=key_schema,
        AttributeDefinitions=attribute_definitions,
        ProvisionedThroughput=provisioned_throughput
    )
    print("Creating Table!")
except dynamodb.exceptions.ResourceInUseException:
    print("this table already exists!")

# wait for the table to become active
waiter = dynamodb.get_waiter('table_exists')
waiter.wait(TableName=table_name)
print("THE TABLE IS NOW READY!")

# Initialize DynamoDB resource and Table object
dynamodb_resource = boto3.resource('dynamodb')
table = dynamodb_resource.Table(table_name)

# now add the items to the table
items = [
    {
        'email': 's3718003@student.rmit.edu.au',
        'username': 'William Wells',
        'password': '012345'
    },
    {
        'email': 's3123456@student.rmit.edu.au',
        'username': 'Firstname Lastname1',
        'password': '123456'
    },
    {
        'email': 's3945672@student.rmit.edu.au',
        'username': 'Firstname Lastname0',
        'password': '012345'
    },
     {
        'email': 's3456789@student.rmit.edu.au',
        'username': 'Firstname Lastname0',
        'password': '012345'
    },
     {
        'email': 's3245678@student.rmit.edu.au',
        'username': 'Firstname Lastname0',
        'password': '012345'
    },
     {
        'email': 's3123457@student.rmit.edu.au',
        'username': 'Firstname Lastname0',
        'password': '012345'
    },
     {
        'email': 's3908765@student.rmit.edu.au',
        'username': 'Firstname Lastname0',
        'password': '012345'
    },
     {
        'email': 's3321987@student.rmit.edu.au',
        'username': 'Firstname Lastname0',
        'password': '012345'
    },
     {
        'email': 's3781928@student.rmit.edu.au',
        'username': 'Firstname Lastname0',
        'password': '012345'
    },
     {
        'email': 's3818301@student.rmit.edu.au',
        'username': 'Firstname Lastname0',
        'password': '012345'
    },
]

with table.batch_writer() as batch:
    for item in items:
        batch.put_item(Item=item)
        print(f"Added item: {item['email']}")
        print(f"Added item: {item['username']}")
        print(f"Added item: {item['password']}")

print("All items added to DynamoDB table!")
