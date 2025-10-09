package eu.projnull.memopad.services.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpStatusCodeException;

public class FolderDoesntBelongToUser extends HttpStatusCodeException {
    public FolderDoesntBelongToUser(String message) {
        super(HttpStatus.FORBIDDEN, message);
    }
}
