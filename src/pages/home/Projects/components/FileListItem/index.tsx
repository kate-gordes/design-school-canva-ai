import React from 'react';
import { Box, Columns, Column, Text, Badge } from '@canva/easel';
import { BasicButton } from '@canva/easel/button';
import { StarIcon, MoreHorizontalIcon } from '@canva/easel/icons';
import { FileText, Image as ImageIcon, Archive, File } from 'lucide-react';
import type { FileData } from '@/pages/Home/Projects/components/FilesSection';

interface FileListItemProps {
  file: FileData;
  onClick?: () => void;
}

// Helper to get icon based on file type
const getFileIcon = (fileType: string) => {
  const type = fileType.toUpperCase();
  switch (type) {
    case 'ZIP':
    case 'RAR':
    case '7Z':
      return { Icon: Archive, isEasel: false };
    case 'TXT':
    case 'MD':
    case 'JSON':
    case 'CSV':
      return { Icon: FileText, isEasel: false };
    case 'AF':
    case 'PSD':
    case 'AI':
    case 'AFDESIGN':
      return { Icon: ImageIcon, isEasel: false };
    default:
      return { Icon: File, isEasel: false };
  }
};

// Helper to get badge tone based on file type
const getBadgeTone = (
  fileType: string,
): 'neutral' | 'info' | 'positive' | 'warning' | 'critical' => {
  const type = fileType.toUpperCase();
  switch (type) {
    case 'ZIP':
    case 'RAR':
    case '7Z':
      return 'info';
    case 'AF':
    case 'PSD':
    case 'AI':
    case 'AFDESIGN':
      return 'positive';
    default:
      return 'neutral';
  }
};

export default function FileListItem({ file, onClick }: FileListItemProps): React.ReactNode {
  const { Icon: FileTypeIcon, isEasel } = getFileIcon(file.fileType);
  const badgeTone = getBadgeTone(file.fileType);

  return (
    <BasicButton onClick={onClick} style={{ width: '100%', textAlign: 'left' }}>
      <Box width="full" padding="2u" borderBottom="standard" style={{ cursor: 'pointer' }}>
        <Columns spacing="2u" alignY="center">
          {/* Name Column */}
          <Column width="fluid">
            <Columns spacing="1u" alignY="center">
              <Column width="content">
                {isEasel ? (
                  <FileTypeIcon size="medium" />
                ) : (
                  <FileTypeIcon size={20} strokeWidth={1.5} />
                )}
              </Column>
              <Column>
                <Text weight="bold">{file.name}</Text>
              </Column>
            </Columns>
          </Column>

          {/* Type Column */}
          <Column width="content">
            <Columns spacing="1u" alignY="center">
              <Column width="content">
                <Badge tone={badgeTone} text={file.fileType} />
              </Column>
              <Column width="content">
                <Text tone="secondary">{file.size}</Text>
              </Column>
            </Columns>
          </Column>

          {/* Edited Column */}
          <Column width="content">
            <Text tone="secondary">Uploaded {file.lastModified}</Text>
          </Column>

          {/* Actions */}
          <Column width="content">
            <Columns spacing="0.5u" alignY="center">
              <Column width="content">
                <BasicButton
                  onClick={e => {
                    e.stopPropagation();
                    console.log('Star file');
                  }}
                >
                  <StarIcon size="small" />
                </BasicButton>
              </Column>
              <Column width="content">
                <BasicButton
                  onClick={e => {
                    e.stopPropagation();
                    console.log('Menu file');
                  }}
                >
                  <MoreHorizontalIcon size="small" />
                </BasicButton>
              </Column>
            </Columns>
          </Column>
        </Columns>
      </Box>
    </BasicButton>
  );
}
