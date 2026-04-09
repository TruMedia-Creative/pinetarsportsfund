# Admin Dashboard Quick Start

## Logging In

1. Navigate to `http://localhost:3000/login`
2. Use these test credentials:
   - **Username**: `admin`
   - **Password**: `password`

## Dashboard Overview

### Home Dashboard
The main dashboard shows key statistics:
- Total Decks
- Published Decks
- Draft Decks
- Total Assets

### Manage Decks

#### Creating a Deck
1. Click "Create New Deck" button
2. Enter a title and description
3. Click "Create Deck"
4. You'll be taken to the edit page

#### Editing a Deck
1. Go to Decks → List
2. Click "Edit" on any deck
3. Modify the deck:
   - **Status**: Change deck stage (draft → ready → exported)
   - **Published**: Toggle to publish/unpublish
   - **Summary**: Add marketing summary (visible on public page when published)
4. Click "Save Changes"

#### Publishing a Deck
1. Open a deck for editing
2. Check the "Published" checkbox
3. Fill in marketing metadata:
   - **Summary**: Brief description for the gallery
   - **Tags**: Categories (investor, lender, sponsor, etc.)
   - **Expiration**: When the opportunity closes
4. Click "Save Changes"
5. The deck now appears in the public Investment Gallery

#### Deleting a Deck
1. Go to Decks → List
2. Click "Delete" on a deck
3. Confirm deletion

### Managing Assets

#### Uploading Assets
1. Go to Admin → Assets
2. Fill in the upload form:
   - **Asset Name**: Friendly name
   - **Type**: Image, chart, logo, headshot, document, or rendering
   - **URL**: Link to the file (can be external)
3. Click "Upload Asset"

#### Using Assets in Decks
Assets can be referenced in deck content when building presentations. Store asset URLs for easy reference.

#### Deleting Assets
1. Go to Admin → Assets
2. Click "Delete" next to an asset
3. The asset is removed (existing references may break)

### Settings

#### Account Settings
- Change admin email
- Update password (leave blank to keep current)

#### Site Settings
- Site name
- Site URL (used in emails and SEO)
- Support email

## Common Tasks

### Create an Investment Opportunity Deck

1. **Create the Deck**
   - Go to Decks → New
   - Enter project name: "Real Estate Investment - Downtown Development"

2. **Build Sections** *(In development)*
   - Add cover slide
   - Add executive summary
   - Add opportunity overview
   - Add financial projections
   - Add use of funds

3. **Upload Assets**
   - Go to Assets
   - Upload property images, financial charts, team photos

4. **Add Marketing Info**
   - Go to Decks → Edit
   - Fill in summary: "Premium office space redevelopment opportunity"
   - Add tags: "real-estate", "development"
   - Set expiration: 90 days

5. **Publish**
   - Check "Published" checkbox
   - Save changes
   - Deck now visible in Investment Gallery

6. **Share with Investors**
   - Send investment gallery link
   - Or direct link: `yourdomain.com/investments/deck-slug`

### Export a Deck as PowerPoint *(In development)*

1. Go to Decks → Edit
2. Click "Download PPTX" button
3. PowerPoint file downloads to your computer
4. Customize in PowerPoint as needed

## Tips & Best Practices

✅ **Do:**
- Use clear, descriptive deck titles
- Publish only when deck is ready for investor review
- Upload high-quality images (logos, team photos)
- Keep summaries concise (2-3 sentences)
- Set realistic expiration dates
- Regularly review and update deck information

❌ **Don't:**
- Leave drafts published unintentionally
- Use low-resolution images
- Share confidential financial data
- Delete assets still in use by decks
- Forget to update expiration dates

## Troubleshooting

### Can't Log In
- Check username and password
- Try clearing browser cookies
- Restart the development server

### Changes Not Saving
- Check browser console for errors
- Ensure database is running
- Try refreshing the page

### Can't See Published Decks
- Confirm the "Published" checkbox is checked
- Verify at least one section is enabled
- Check the investment gallery after refresh

### Assets Not Loading
- Verify the asset URL is correct
- Check the URL is accessible (not blocked)
- Try a different image format

## Security Notes

⚠️ **This is a development setup. For production:**

1. **Change Admin Credentials**
   - Update `server/routes/api/admin/auth.post.ts`
   - Implement proper user management

2. **Add Password Hashing**
   - Install `bcrypt`
   - Hash passwords before storing
   - Compare hashed passwords on login

3. **Implement JWT**
   - Use proper JWT signing/verification
   - Add token expiration
   - Refresh token mechanism

4. **Enable HTTPS**
   - Use SSL certificates
   - Set secure cookies
   - Implement CORS properly

5. **Database Security**
   - Move database outside web root
   - Regular backups
   - Access controls

## Getting Help

- Check the main [NUXT_SETUP.md](./NUXT_SETUP.md) for technical details
- Review API routes in `server/routes/api/`
- Check Vue components in `components/`
- Review composables in `composables/`
