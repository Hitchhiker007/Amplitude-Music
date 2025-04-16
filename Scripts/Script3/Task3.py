import boto3
import json
import requests
from io import BytesIO

# create a s3 instance
s3 = boto3.client('s3')

bucket_name = 's3-music-images-hitchhiker'

s3.create_bucket(
    Bucket=bucket_name,
    CreateBucketConfiguration={'LocationConstraint': 'ap-southeast-2'}  
)
print(f"Bucket '{bucket_name}' was successfully created!")

# load data from json
with open('a1.json') as json_file:
    data = json.load(json_file)

# get the songs from the JSON data
songs = data.get('songs', [])

# main function
def upload_images_to_s3(songs, bucket_name):
    for song in songs:
        # get image 
        image_url = song.get('img_url')
        if image_url:
            response = requests.get(image_url)
            # will raise a HTTPError if there are any bad responses
            # response.raise_for_status()  
            image_file = BytesIO(response.content)
            # get the file name from the url by accessing the last element
            # so here:
            # "https://raw.githubusercontent.com/davidpots/songnotes_cms/master/public/images/artists/Sublime.jpg"
            # becomes "Sublime.jpg"
            filename = image_url.split('/')[-1]
            # upload image to s3
            s3.upload_fileobj(image_file, bucket_name, filename)
            print(f"Uploaded {filename} to S3 bucket '{bucket_name}'")
             


# finally call the function to intialize the script
upload_images_to_s3(songs, bucket_name)
