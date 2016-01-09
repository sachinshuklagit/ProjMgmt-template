package com.proj.projmgmt.web.common.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.jms.core.MessageCreator;
import org.springframework.stereotype.Component;

import javax.jms.*;
import java.io.Serializable;

/**
 * Created by Shukla, Sachin. on 3/10/15.
 */

//@Component
public class MyJmsHandler implements IMyJmsHandler{

//    @Autowired
//    @Qualifier("jmsTemplateForMyQueue")
//    @Qualifier("jmsTemplateForMySQSQueue")
    private JmsTemplate jmsTemplate;

//    @Autowired
//    @Qualifier("myQueue")
//    @Qualifier("mySQSQueue")
    private Destination destination;

    public void sendMessage(final Serializable object) throws JMSException {

        // Use Spring's JmsTemplate to send JMS message to queue
        jmsTemplate.setExplicitQosEnabled(true);
        jmsTemplate.setSessionAcknowledgeMode(Session.AUTO_ACKNOWLEDGE);

        jmsTemplate.send(destination, new MessageCreator() {
            public Message createMessage(Session session) throws JMSException {
                ObjectMessage message = session.createObjectMessage(object);
                System.out.println("msg is being send to MyQueue.."+message);
                return message;
            }
        });
    }
}
