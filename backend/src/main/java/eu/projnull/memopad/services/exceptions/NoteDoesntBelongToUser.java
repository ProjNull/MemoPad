package eu.projnull.memopad.services.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class NoteDoesntBelongToUser extends ResponseStatusException {
  public NoteDoesntBelongToUser(String message) {
    super(HttpStatus.FORBIDDEN, message);
  }
}
