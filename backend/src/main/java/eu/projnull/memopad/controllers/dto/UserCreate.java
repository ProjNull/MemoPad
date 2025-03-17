package eu.projnull.memopad.controllers.dto;

import lombok.Data;

@Data
public class UserCreate {
    private String email;
    private String username;
    private String password;
}
