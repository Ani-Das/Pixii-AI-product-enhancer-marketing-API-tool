import os
from dotenv import load_dotenv
import requests

from flask import Flask, request, jsonify
from flask_cors import CORS

from PIL import Image
import io

load_dotenv()

from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Flask server is running 🚀"


@app.route('/upgrade', methods=['POST'])
def upgrade():
    data = request.json
    image_url = data.get("imageUrl")

    try:
        
        # Step 1: Understand the image

        try:
            vision_response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": "Describe this product in one short line"},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": image_url
                                }
                            }
                        ]
                    }
                ]
            )

            product_description = vision_response.choices[0].message.content

        except Exception as e:
            print("Vision failed:", e)
            product_description = "product"
                
        
        #open API
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": f"Write a HIGH-CONVERTING , punchy ecommerce Amazon product hook under 10-12 words that creates urgency and desire for this product: {product_description}"
                }
            ],
        )

        hook = response.choices[0].message.content
        

        # Remove.bg image processing
        remove_bg_url = "https://api.remove.bg/v1.0/removebg"

        response_img = requests.post(
            remove_bg_url,
            data={
                "image_url": image_url,
                "size": "auto"
            },
            headers={
                "X-Api-Key": os.getenv("REMOVE_BG_API_KEY")
            },
        )

        if response_img.status_code == 200:
            import base64
            enhanced_image = "data:image/png;base64," + base64.b64encode(response_img.content).decode()
        else:
            enhanced_image = image_url

        try:
            ai_image_response = client.images.generate(
                model="gpt-image-1",
                prompt=f"""
                This is a {product_description}.
                Place it in a realistic, advertisement-friendly setting that suits its category.
                Make it visually appealing, natural lighting, high-end product photography.
                """,
                size="1024x1024"
            )

            ai_image = "data:image/png;base64," + ai_image_response.data[0].b64_json

        except Exception as e:
            print("AI image failed:", e)
            ai_image = enhanced_image
            
        return jsonify({
            "enhancedImage": enhanced_image,
            "aiImage": ai_image,
            "hook": hook
        })

    except Exception as e:
        print("ERROR:", e)
        hook = "Make your product stand out instantly."
        return jsonify({
        "error": "Server busy. Try again in a moment."
    }), 500


if __name__ == "__main__":
    app.run(port=5000, debug=True)