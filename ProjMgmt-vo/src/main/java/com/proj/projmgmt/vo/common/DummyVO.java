package com.proj.projmgmt.vo.common;

import java.util.Arrays;
import java.util.List;

/**
 * Created by Shukla, Sachin. on 3/8/15.
 */
public class DummyVO {

    private int id;
    private String name;
    private List<String> attribures;

    public static DummyVO getObj(){

        DummyVO vo = new DummyVO();
        vo.setId(1);
        vo.setName("test name");
        vo.setAttribures(Arrays.asList("attr1", "attr2", "attr3"));
        return vo;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getAttribures() {
        return attribures;
    }

    public void setAttribures(List<String> attribures) {
        this.attribures = attribures;
    }
}
