export const validateDiaryEntry = (data) => {
    const errors = [];
  
    // Title: required, string, 3–100 chars
    if (!data.title || typeof data.title !== 'string') {
      errors.push("Title is required and must be a string.");
    } else if (data.title.length < 3) {
      errors.push("Title must be at least 3 characters long.");
    } else if (data.title.length > 100) {
      errors.push("Title must be no more than 100 characters.");
    }
  
    // Content: required, string, 10+ chars
    if (!data.content || typeof data.content !== 'string') {
      errors.push("Content is required and must be a string.");
    } else if (data.content.length < 10) {
      errors.push("Content must be at least 10 characters long.");
    }
  
    // Location: optional, only letters/spaces
    if (data.location && !/^[A-Za-z\s]+$/.test(data.location)) {
      errors.push("Location must contain only letters and spaces.");
    }
  
    // Tags: optional, must be array of strings, max 10 tags
    if (data.tags) {
      if (!Array.isArray(data.tags)) {
        errors.push("Tags must be an array.");
      } else {
        if (data.tags.length > 10) {
          errors.push("You can specify up to 10 tags.");
        }
        for (let tag of data.tags) {
          if (typeof tag !== 'string' || tag.length < 2 || tag.length > 20) {
            errors.push("Each tag must be a string between 2 and 20 characters.");
            break;
          }
        }
      }
    }
  
    // Reflection: optional, string <= 500
    if (data.reflection && typeof data.reflection !== 'string') {
      errors.push("Reflection must be a string.");
    } else if (data.reflection && data.reflection.length > 500) {
      errors.push("Reflection must be under 500 characters.");
    }
  
    return {
      isValid: errors.length === 0,
      errors,
    };
  };
  