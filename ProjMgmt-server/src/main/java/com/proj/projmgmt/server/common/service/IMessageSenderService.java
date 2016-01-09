package com.proj.projmgmt.server.common.service;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;

/**
 * Created by Shukla, Sachin. on 3/9/15.
 */
public interface IMessageSenderService {
    public HttpResponse<JsonNode> sendSMS(String receiver, String msgToSend) throws Exception;
}
