export enum FileTypes {
  Profile = 'Profile',
  Group = 'Group',
  Image = 'Image',
  Attachment = 'Attachment',
}

export const KeyPrefixes: Record<FileTypes, string> = {
  [FileTypes.Profile]: 'profile',
  [FileTypes.Group]: 'group',
  [FileTypes.Image]: 'image',
  [FileTypes.Attachment]: 'attachment',
};
