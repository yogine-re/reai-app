import { useState } from 'react';
import React from 'react';
import Typography from '@mui/material/Typography';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { TypeIcon } from './TypeIcon';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { useDragOver } from '@minoru/react-dnd-treeview';
import { useAppData } from '../../context/AppContext';
import styles from './CustomNode.module.css';

export const CustomNode = (props: any) => {
  const { updateProject } = useAppData();
  const { id, text } = props.node;
  const [visibleInput, setVisibleInput] = useState(false);
  const [labelText, setLabelText] = useState(text);
  const { droppable, data } = props.node;
  const indent = props.depth * 24;

  const handleToggle = (e: any) => {
    e.stopPropagation();
    props.onToggle(props.node.id);
  };

  const handleSelect = () => props.onSelect(props.node);

  const handleShowInput = () => {
    setVisibleInput(true);
  };

  const handleCancel = () => {
    setLabelText(text);
    setVisibleInput(false);
  };

  const handleChangeText = (e: any) => {
    setLabelText(e.target.value);
  };

  const handleSubmit = () => {
    setVisibleInput(false);
    props.onTextChange(id, labelText);
    updateProject(labelText);
  };

  const dragOverProps = useDragOver(id, props.isOpen, props.onToggle);

  return (
    <div
      className={`tree-node ${styles.root} ${
        props.isSelected ? styles.isSelected : ''
      }`}
      style={{ paddingInlineStart: indent }}
      onClick={handleSelect}
      {...dragOverProps}
    >
      <div
        className={`${styles.expandIconWrapper} ${
          props.isOpen ? styles.isOpen : ''
        }`}
      >
        {props.node.droppable && (
          <div onClick={handleToggle}>
            <ArrowRightIcon />
          </div>
        )}
      </div>

      <div className={styles.labelGridItem}>
        {visibleInput ? (
          <div className={styles.inputWrapper}>
            <TextField
              className={`${styles.textField}
              ${styles.nodeInput}`}
              value={labelText}
              onChange={handleChangeText}
            />
            <IconButton
              className={styles.editButton}
              onClick={handleSubmit}
              disabled={labelText === ''}
            >
              <CheckIcon className={styles.editIcon} />
            </IconButton>
            <IconButton className={styles.editButton} onClick={handleCancel}>
              <CloseIcon className={styles.editIcon} />
            </IconButton>
          </div>
        ) : (
          <div className={styles.inputWrapper}>
            <div>
              <TypeIcon droppable={droppable} fileType={data?.fileType} />
            </div>
            <Typography variant='body2' className={styles.nodeLabel}>
              {props.node.text}
            </Typography>
            {Object.keys(props.node.data).length === 0 ?
            <IconButton className={styles.editButton} onClick={handleShowInput}>
                <EditIcon className={styles.editIcon} />
            </IconButton>
            : ''}
          </div>
        )}
      </div>
    </div>
  );
};
