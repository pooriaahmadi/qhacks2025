import cohere


def TOS_json(TOS):
    co = cohere.ClientV2("Kg8tacIRXTmZcez9wyOCjckUyo6kCH3tIQAx7Yb7")
    TOS = TOS[:18000] if len(TOS) > 18000 else TOS
    response = co.chat(
        model="command-r-plus-08-2024",
        messages=[
            {
                "role": "system",
                "content": """You are a genius lawyer who is an expert at finding potential risks in terms of services for your clients. You will be given a terms of service document, find the faults and give each a heading, a description, and a direct quote that backs your claim. Be very concise. Provide direct quotes to back each claim using only the original text. potential risk foundation topics could be privacy, unmonitored payments, and OTHER THINGS TOO.""",
            },
            {
                "role": "user",
                "content": TOS,
            },
        ],
        response_format={
            "type": "json_object",
            "schema": {
                "type": "object",
                "properties": {
                    "faults": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "FaultHeading": {"type": "string"},
                                "FaultQuote": {"type": "string"},
                                "FaultDescription": {"type": "string"},
                            },
                            "required": [
                                "FaultHeading",
                                "FaultDescription",
                                "FaultQuote",
                            ],
                        },
                    }
                },
                "required": ["faults"],
            },
        },
    )
    return response.message.content[0].text
