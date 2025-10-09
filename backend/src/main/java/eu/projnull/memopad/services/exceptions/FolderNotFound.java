package eu.projnull.memopad.services.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpStatusCodeException;

public class FolderNotFound extends HttpStatusCodeException {
    public FolderNotFound(String message) {
        super(HttpStatus.NOT_FOUND, message);
    }
}