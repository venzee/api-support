require 'rest_client'
require 'json'


@access_token = ""

CLIENT_ID = "<YOUR_CLIENT_ID>"
CLIENT_SECRET = "<YOUR_CLIENT_SECRET>"

def get_access_token()
  url  = "https://api-qa.venzee.com/api/app/token" 
  data = {
          :id => CLIENT_ID,
          :secret => CLIENT_SECRET,
         }

  #Execute the call and get the response
  response = RestClient.post(url, data, :accept => :json)

  # Show the response code -- 200 = Success
  #puts "\nResult Code : " + response.code.to_s
  
  # Parse the raw response
  data_parsed = JSON.parse(response)

  # Show the raw response
  #puts JSON.pretty_generate(data_parsed)

  puts "\n>>> Access token Acquired: #{data_parsed['access_token']}"
  
  return data_parsed["access_token"]
end


def get_authenticated_user(token)

  url         = "https://api-qa.venzee.com/api/user"
  auth_param  = 'Bearer ' + token

  response = RestClient.get(url, {:accept => :json, :Authorization => auth_param})

  #puts "\nResult Code : " + response.code.to_s

  # Parse the data and show info from the authenticated user  
  parsed_data = JSON.parse(response)
  puts "\n\nAuthenticated user information: \n\n"
  puts JSON.pretty_generate(parsed_data)
  
end


def get_collection_list(token, company_name)

  # Example how to get the list of collection for a company
  url         = "https://api-qa.venzee.com/api/orgs/#{company_name}/collections"
  auth_param  = 'Bearer ' + token

  response = RestClient.get(url, {:accept => :json, :Authorization => auth_param})

  #puts "\nResult Code : " + response.code.to_s
  
  # Show the list of collection
  parsed_data = JSON.parse(response)
  puts "\n\nList of Collections: \n\n"
  puts JSON.pretty_generate(parsed_data)

end


def show_product_list(token, company_name, collection_name)

  # Example how to get the list of product from a specific collection
  url         = "https://api-qa.venzee.com/api/collections/#{company_name}/#{collection_name}/records?offset=0&limit=50"
  auth_param  = 'Bearer ' + token
  table       = ""

  response = RestClient.get(url, {:accept => :json, :Authorization => auth_param})

  # Show raw response
  #puts "\nResult Code : " + response.code.to_s
  
  # Parse the data to get it in json format
  parsed_data = JSON.parse(response)
  puts "\n\nProduct List: \n\n"
  #puts JSON.pretty_generate(parsed_data)



  # Display a formated table with the list of record
  puts "\nRecord Id \t | Name \t | Cost"
  puts "-------------------------------------------------"

  for i in 0..parsed_data.length - 1
    table += parsed_data[i]["recordId"].to_s + "\t\t   " + parsed_data[i]["name"].to_s + "\t"

    if parsed_data[i]["name"].length < 5
      table += "\t"
    end

    table +=  "   " + parsed_data[i]["cost"].to_s + " " + parsed_data[i]["currency"].to_s + "\n"
  end

  # Show the formatted table
  puts table

end


def get_product_list(token, company_name, collection_name)

  # Close to the example above, but it's to get data to push it to Shopify as an "example integration"
  url         = "https://api-qa.venzee.com/api/collections/#{company_name}/#{collection_name}/records?offset=0&limit=50"
  auth_param  = 'Bearer ' + token
  table       = ""

  x = RestClient.get(url, {:accept => :json, :Authorization => auth_param})

  #puts "\nResult Code : " + x.code.to_s
  data = JSON.parse(x)

  return data

end




########################################################################################################

# Test function to authenticate a user, then get some basic information.
@access_token = get_access_token()
get_authenticated_user(@access_token)
get_collection_list(@access_token, "msylvestre-corp")
show_product_list(@access_token, "msylvestre-corp", "api-curl-created")


puts "\n>>> DONE !"



