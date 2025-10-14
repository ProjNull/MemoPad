package eu.projnull.memopad.services.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class FolderNotFound extends ResponseStatusException {
  public FolderNotFound(String message) {
    super(HttpStatus.NOT_FOUND, message);
  }
}
