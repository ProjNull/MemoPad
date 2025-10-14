package eu.projnull.memopad.services.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class FolderDoesntBelongToUser extends ResponseStatusException {
  public FolderDoesntBelongToUser(String message) {
    super(HttpStatus.FORBIDDEN, message);
  }
}
