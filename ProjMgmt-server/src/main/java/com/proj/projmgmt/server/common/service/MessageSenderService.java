package com.proj.projmgmt.server.common.service;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import org.springframework.stereotype.Component;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

/**
 * Created by Shukla, Sachin. on 3/9/15.
 */
@Component
public class MessageSenderService implements  IMessageSenderService{

    static final String charset = "UTF-8";



    @Override
    public HttpResponse<JsonNode> sendSMS(String receiver, String msgToSend) throws Exception {
        String url = ReadProperties.getProperties().getProperty("sms.service.url") + "?" + buildRequestString(receiver,msgToSend);
        System.out.println("url=" + url);
        HttpResponse<JsonNode> response = Unirest.get(url)
                .header("X-Mashape-Key", ReadProperties.getProperties().getProperty("sms.mashape.key"))
                .header("Accept", "application/json")
                .asJson();
        printResponse(response);
        return response;
    }

    private static void printResponse(HttpResponse<JsonNode> response){
        if(response == null){
            System.out.println("Response="+response);
            return;
        }

        System.out.println("status="+response.getStatus()+", body="+response.getHeaders()+", raw body="+response.getRawBody());
    }

    private static String buildRequestString(String targetPhoneNo, String message) throws UnsupportedEncodingException
    {
        String [] params = new String [5];
        params[0] = ReadProperties.getProperties().getProperty("sms.uid");
        params[1] = ReadProperties.getProperties().getProperty("sms.pwd");
        params[2] = message;
        params[3] = targetPhoneNo;
//        params[4] = "site2sms";

        String query = String.format("uid=%s&pwd=%s&msg=%s&phone=%s",
                URLEncoder.encode(params[0], charset),
                URLEncoder.encode(params[1],charset),
                URLEncoder.encode(params[2],charset),
                URLEncoder.encode(params[3],charset)
        );
        return query;
    }
}
