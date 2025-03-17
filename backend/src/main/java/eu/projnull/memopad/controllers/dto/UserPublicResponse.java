package eu.projnull.memopad.controllers.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserPublicResponse {
    private Long id;
    private String username;
    private String email;
}
