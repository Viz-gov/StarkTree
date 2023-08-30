import requests
import sys

from starknet_py.contract import Contract
from starknet_py.net.gateway_client import GatewayClient


BASE_URL = "https://projects.propublica.org/nonprofits/api/v2"

def search_nonprofit(query):
    """Search for a nonprofit organization using the ProPublica Nonprofit Explorer API."""
    endpoint = "/search.json"
    url = f"{BASE_URL}{endpoint}"
    
    params = {
        'q': query
    }

    response = requests.get(url, params=params)

    if response.status_code != 200:
        print(f"Error: Received status code {response.status_code}")
        return None
    
    data = response.json()

    exact_match_found = False
    # Here we're just printing the organizations found, but you can process this data further as needed
    for org in data.get("organizations", []):
        if org['name'].strip().lower() == query.strip().lower():
            print(f"Name: {org['name']}")
            var1 = org['name']
            print(f"EIN: {org['ein']}")
            var2 = org['ein']
            print(f"City: {org['city']}")
            var3 = org['city']
            print(f"State: {org['state']}")
            var4 = org['state']
            print("----------")
            exact_match_found = True
    if not exact_match_found:
        print(f"No exact match found for '{query}'.")
    
    return True if exact_match_found else False

# Example usage
if __name__ == "__main__":
    #query = input("Enter the name of the nonprofit organization: ")
    # print(sys.argv)
    org_name = sys.argv[1]
    wallet_address = int(sys.argv[2], 16)
    print(type(wallet_address))
    print('A')
    print(org_name)
    print('B')
    # website_link = sys.argv[3]
    org_name_modified = org_name.replace("-"," ")
    verify = search_nonprofit(org_name_modified)
    # put onto blockchain

    if verify:
        CONTRACT_ADDR = 0x073197ad766e96fe1e4634b855056fe6f00acd77b19463e4f149fca224e38942
        def felt_to_str(felt):
            length = (felt.bit_length() + 7) // 8
            return felt.to_bytes(length, byteorder="big").decode("utf-8")
        contract = Contract.from_address_sync(
            address= CONTRACT_ADDR,
            provider=GatewayClient("testnet"),)
        (value,) = contract.functions["get_link"].call_sync(wallet_address)
        print(felt_to_str(value))
    else:
        print("No")
