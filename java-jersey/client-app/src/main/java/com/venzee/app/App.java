package com.venzee.app;

 
import org.json.JSONObject;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.core.util.Base64;

/**
 * JAVA client to integrate with VENZEE API
 *
 */
public class App 
{
    public static void main( String[] args )
    {
      try {
        
        String USERNAME = "<SET USERNAME>";
        String PASSWORD = "<SET PASSWORD>";
        String API_ID = "<SET APP_ID>";
        String API_PASSWORD = "<SET APP_PASSWORD>";
        String END_POINT = "https://sandbox.venzee.com";
          
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("username", USERNAME);
        jsonObject.put("password", PASSWORD);
        jsonObject.put("grant_type", "password");
  
        System.out.println(jsonObject.toString());
        String input = jsonObject.toString();
 
        Client client = Client.create();    
       
        String auth = new String(Base64.encode(API_ID + ":" + API_PASSWORD));

        //client.addFilter(new HTTPBasicAuthFilter(API_ID, API_PASSWORD));

        WebResource resource = client.resource(END_POINT + "/oauth/token");    
        ClientResponse response = resource.header("Authorization", "Basic " + auth)
          .type("application/json").accept("application/json").post(ClientResponse.class, input);
        
        System.out.println("Status response:" +  response.toString());
        if(response.getStatus() == 200){
            
            String output = response.getEntity(String.class);
            JSONObject respTkn = new JSONObject(output);
            String token = respTkn.getString("access_token");
            System.out.println("Token: " +  token );
            getUserInfo(token);
            
        } else System.out.println("Somthing went wrong..!");        
    
       
      } catch (Exception e) {

        System.out.println("\nError while calling REST Service");
        System.out.println(e);
        e.printStackTrace();    

      }

    }
    /**
    * Get the profile from the current user
    */
    private static void getUserInfo(String token) {

      Client client = Client.create();    
      WebResource resource = client.resource(END_POINT + "/api/user");    
      ClientResponse response = resource
        .type("application/json").accept("application/json")
        .header(javax.ws.rs.core.HttpHeaders.AUTHORIZATION, "Bearer " + token)
        .get(ClientResponse.class);
        System.out.println("Status response:" +  response.toString());
        if(response.getStatus() == 200){
            
            String output = response.getEntity(String.class);
            System.out.println("Current user: " +  output );
            
        } else System.out.println("Somthing went wrong..!");   
    
    }
}
