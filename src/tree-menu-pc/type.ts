type File = {
  name: string;
  kind: "file";
  handler: FileSystemFileHandle;
};
type Directory = {
  name: string;
  kind: "directory";
  handler: FileSystemDirectoryHandle;
  children?: Array<File | Directory>;
};

export type { Directory, File };
