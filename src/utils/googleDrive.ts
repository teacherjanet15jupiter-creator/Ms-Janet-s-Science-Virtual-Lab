export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  webViewLink?: string;
  iconLink?: string;
}

export interface ImportedBankItem {
  id: string;
  sourceFileId: string;
  sourceFileName: string;
  title: string;
  topic: 'forces' | 'ecosystems' | 'energy' | 'earth_space' | 'plant_transport' | 'circuits';
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  p6KeyConcept: string;
  difficulty: 'Foundation' | 'Standard' | 'Challenger';
  curriculumRef: string;
}

export const extractFolderId = (urlOrId: string): string => {
  const match = urlOrId.match(/folders\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return urlOrId.trim();
};

export const fetchDriveFolderFiles = async (
  folderId: string,
  accessToken: string
): Promise<DriveFileItem[]> => {
  const cleanId = extractFolderId(folderId);
  const q = `'${cleanId}' in parents and trashed = false`;
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name,mimeType,size,modifiedTime,webViewLink,iconLink)&pageSize=50`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Drive API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return data.files || [];
};

export const fetchDriveFileContent = async (
  file: DriveFileItem,
  accessToken: string
): Promise<string> => {
  let downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;

  if (file.mimeType === 'application/vnd.google-apps.document') {
    downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/plain`;
  } else if (file.mimeType === 'application/vnd.google-apps.spreadsheet') {
    downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/csv`;
  }

  const response = await fetch(downloadUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Could not fetch content for file ${file.name}`);
  }

  return await response.text();
};
