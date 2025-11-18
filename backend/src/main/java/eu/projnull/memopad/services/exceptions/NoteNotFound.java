package eu.projnull.memopad.services.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class NoteNotFound extends ResponseStatusException {
  public NoteNotFound(String message) {
    super(HttpStatus.NOT_FOUND, message);
  }
}
