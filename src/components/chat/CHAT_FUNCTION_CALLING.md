# Chat Function Calling - Add Person Contacts

The chat system now supports LLM function calling to create person contacts directly through conversation.

## How it Works

1. **User Request**: Users can ask the chat to create a new person contact
2. **LLM Processing**: Claude analyzes the request and extracts contact information
3. **Function Execution**: The system automatically calls the `create_person_contact` function
4. **Database Update**: The contact is created in Supabase with all related data
5. **User Feedback**: The chat shows success/failure status and refreshes the page

## Example Usage

### Simple Contact Creation
```
User: "Add a new contact named John Smith with email john@example.com"
```

### Detailed Contact Creation
```
User: "Create a contact for Sarah Johnson, she works at Acme Corp as a Marketing Manager. Her email is sarah.johnson@acme.com and phone is 555-123-4567. She's located in San Francisco, CA. Her LinkedIn is linkedin.com/in/sarahjohnson"
```

### Batch Information
```
User: "Add Jane Doe, jane@company.com, 555-987-6543, works at TechStart as CTO, based in Austin, TX"
```

## Supported Fields

The function can extract and create contacts with:

- **first_name**: First name of the person
- **last_name**: Last name of the person  
- **_emails**: Array of email addresses
- **_phones**: Array of phone numbers
- **company_name**: Company name (auto-created if doesn't exist)
- **job_title**: Job title/position
- **city**: City location
- **state**: State location
- **linkedin**: LinkedIn profile URL
- **description**: Additional notes

## Technical Implementation

### API Route (`/api/chat`)
- Uses Anthropic Claude with function calling
- Defines `create_person_contact` function schema
- Executes function and provides feedback

### Function Definition
```typescript
{
  name: 'create_person_contact',
  description: 'Create a new person contact in the database...',
  input_schema: {
    type: 'object',
    properties: {
      first_name: { type: 'string', description: '...' },
      // ... other fields
    }
  }
}
```

### Action Handling
- Chat messages show function execution status
- Success/failure indicators in the UI
- Automatic page refresh after successful creation
- Toast notifications for user feedback

## Error Handling

- Validates required fields (at least first or last name)
- Handles database errors gracefully
- Shows specific error messages to users
- Logs detailed errors for debugging

## Integration with Existing Features

- Works with the existing person management system
- Uses the same `createPerson` action as the manual forms
- Integrates with company auto-creation
- Maintains data consistency and relationships

## Future Enhancements

Potential additions:
- Update existing contacts
- Delete contacts
- Bulk operations
- Search and filter functions
- Company management functions
- Import/export capabilities