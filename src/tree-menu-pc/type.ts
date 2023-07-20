type FileOrDirectory = {
  name: string;

  active?: boolean;
  focus?: boolean;
} & (
  | {
      kind: "file";
      handler: FileSystemFileHandle;
    }
  | {
      kind: "directory";
      handler: FileSystemDirectoryHandle;
      children?: Array<FileOrDirectory>;
    }
);

type Directory = Extract<FileOrDirectory, { kind: "directory" }>;
type File = Extract<FileOrDirectory, { kind: "file" }>;

export type { FileOrDirectory, Directory, File };
