package com.proj.projmgmt.web.common.rest;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import javax.jms.Message;
import javax.jms.MessageListener;

/**
 * Created by Shukla, Sachin. on 3/10/15.
 */

@Component
@Qualifier("myJmsListener")
public class MyJmsListener implements MessageListener {


    @Override
    public void onMessage(Message message) {
        System.out.println("Listening to SQS Queue MyQueue..msg="+message);

        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
