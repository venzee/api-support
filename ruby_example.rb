=begin
  
#1. create user
curl -X POST -H "Content-Type:application/json" -d "{\"username\": \"<user>\", \"password\": \"<pwd>\", \"firstName\": \"Api\", \"lastName\": \"Master\", \"email\": \"apimaster@venzee.com\"}"  https://api-qa.venzee.com/api/users

#2. get token
curl -u "<id>:<secret>" --data "grant_type=password&username=<user>&password=<pwd>" -i https://api-qa.venzee.com/oauth/token

#3. get authenticated user
curl -X GET -H "Authorization: Bearer <token>"   -i https://api-qa.venzee.com/api/user

#4. create company
curl -X POST -H "Authorization: Bearer <token>"  -d "name=walmart&description=sellprodcut&logo=s3url" -i https://api-qa.venzee.com/api/orgs

#5. get the company by company name, 'walmart' the the company name, in the /api/orgs/{orgname}
curl -X GET -H "Authorization: Bearer <token>"   -i https://api-qa.venzee.com/api/orgs/walmart

#6. get the companies the authenticated user belongs to
curl -X GET -H "Authorization: Bearer <token>"   -i https://api-qa.venzee.com/api/user/orgs

=end

require 'rest_client'
require 'json'

@data = ""
@access_token = ""

CLIENT_ID = "<id>"
CLIENT_SECRET = "<secret>"

def get_access_token(username, password)
  url  = "https://<id>:<secret>@api-qa.venzee.com/oauth/token"
  data = {
          :username => username,
          :password => password,
          :grant_type => 'password'
         }

  x = RestClient.post(url, data, :accept => :json)

  #puts "\nResult Code : " + x.code.to_s
  @data = JSON.parse(x)

  #puts JSON.pretty_generate(@data)

  puts "\n>>> Access token Acquired for '#{username}'"
  
  return @data["access_token"]
end


def get_authenticated_user(token)

  url         = "https://api-qa.venzee.com/api/user"
  auth_param  = 'Bearer ' + token

  x = RestClient.get(url, {:accept => :json, :Authorization => auth_param})

  #puts "\nResult Code : " + x.code.to_s
  #@data = JSON.parse(x)

  puts JSON.pretty_generate(@data)
  
end


def create_company(token)

  url         = "https://api-qa.venzee.com/api/orgs"
  auth_param  = 'Bearer ' + token
  data = {
          :name => 'api-corp',
          :displayName => 'API Corp.',
          :description => 'This is my company',
          :address => "17565 jacques-plante"
         }

  x = RestClient.post(url, data, {:accept => :json, :Authorization => auth_param})

  puts "\nResult Code : " + x.code.to_s
  @data = JSON.parse(x)

  puts JSON.pretty_generate(@data)
  
end

def get_collection(token, company_name)

  url         = "https://api-qa.venzee.com/api/orgs/#{company_name}/collections"
  auth_param  = 'Bearer ' + token

  x = RestClient.get(url, {:accept => :json, :Authorization => auth_param})

  #puts "\nResult Code : " + x.code.to_s
  @data = JSON.parse(x)

  #puts JSON.pretty_generate(@data)
  puts "\n>>> Collection Name: " + @data[0]["name"].to_s

end


def show_product_list(token, company_name, collection_name)

  url         = "https://api-qa.venzee.com/api/collections/#{company_name}/#{collection_name}/records?offset=0&limit=50"
  auth_param  = 'Bearer ' + token
  table       = ""

  x = RestClient.get(url, {:accept => :json, :Authorization => auth_param})

  #puts "\nResult Code : " + x.code.to_s
  @data = JSON.parse(x)

  #puts JSON.pretty_generate(@data)

  puts "\nRecord Id \t | Name \t | Cost"
  puts "-------------------------------------------------"

  for i in 0..@data.length - 1
    table += @data[i]["recordId"].to_s + "\t\t   " + @data[i]["name"].to_s + "\t"

    if @data[i]["name"].length < 5
      table += "\t"
    end

    table +=  "   " + @data[i]["cost"].to_s + " " + @data[i]["currency"].to_s + "\n"
  end

  puts table

end


def push_to_shopify(data)

  api_key = "<id>"
  pwd = "<secret>"

  shop_url = "https://#{api_key}:#{pwd}@venzee.myshopify.com/admin/products.json"

  x = RestClient.post(shop_url, data, {:accept => :json})

  #puts "\nResult Code : " + x.code.to_s
  y = JSON.parse(x)

  #puts JSON.pretty_generate(y)

end

def get_product_list(token, company_name, collection_name)

  url         = "https://api-qa.venzee.com/api/collections/#{company_name}/#{collection_name}/records?offset=0&limit=50"
  auth_param  = 'Bearer ' + token
  table       = ""

  x = RestClient.get(url, {:accept => :json, :Authorization => auth_param})

  #puts "\nResult Code : " + x.code.to_s
  data = JSON.parse(x)

  return data

end

def transform_for_shopify(raw)

  data3 = {
    product: {
      title: raw["name"],
      body_html: "<strong>From Venzee!<\/strong>",
      vendor: "AcmeStore",
      product_type: "shirts",
    }
  }

  return data3

end






########################################################################################################

@access_token = get_access_token("<user>", "<pwd>")

#get_authenticated_user(@access_token)
#create_company(@access_token)
#get_collection(@access_token, "api-corp")

show_product_list(@access_token, "api-corp", "acme")
raw = get_product_list(@access_token, "api-corp", "acme")

puts "\n>>> Pushing " + raw.length.to_s + " products to your Shopify store..."

for i in 0..raw.length - 1
  push_to_shopify(transform_for_shopify(raw[i]))
end

puts "\n>>> DONE !"



