import dayjs from 'dayjs';
import EditForm from 'modules/boards/containers/editForm/EditForm';
import { ItemContainer, ItemDate } from 'modules/boards/styles/common';
import { Footer, PriceContainer, Right } from 'modules/boards/styles/item';
import { Content, ItemIndicator } from 'modules/boards/styles/stage';
import { IOptions } from 'modules/boards/types';
import { renderPriority } from 'modules/boards/utils';
import { __, getUserAvatar } from 'modules/common/utils';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { ITask } from '../types';

type Props = {
  stageId: string;
  item: ITask;
  isDragging: boolean;
  provided;
  onAdd: (stageId: string, item: ITask) => void;
  onRemove: (dealId: string, stageId: string) => void;
  onUpdate: (item: ITask) => void;
  onTogglePopup: () => void;
  options: IOptions;
};

export default class TaskItem extends React.PureComponent<
  Props,
  { isFormVisible: boolean }
> {
  constructor(props) {
    super(props);

    this.state = { isFormVisible: false };
  }

  renderDate(date) {
    if (!date) {
      return null;
    }

    return <ItemDate>{dayjs(date).format('MMM D, h:mm a')}</ItemDate>;
  }

  toggleForm = () => {
    this.props.onTogglePopup();

    const { isFormVisible } = this.state;

    this.setState({ isFormVisible: !isFormVisible });
  };

  renderForm = () => {
    const { stageId, item, onAdd, onRemove, onUpdate, options } = this.props;
    const { isFormVisible } = this.state;

    if (!isFormVisible) {
      return null;
    }

    return (
      <Modal bsSize="lg" show={true} onHide={this.toggleForm}>
        <Modal.Header closeButton={true}>
          <Modal.Title>{__('Edit task')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditForm
            options={options}
            stageId={stageId}
            itemId={item._id}
            onAdd={onAdd}
            onRemove={onRemove}
            onUpdate={onUpdate}
            closeModal={this.toggleForm}
          />
        </Modal.Body>
      </Modal>
    );
  };

  renderInnerItem() {
    const { content, contentType } = this.props.item;

    if (!content) {
      return null;
    }

    let value;
    switch (contentType) {
      case 'deal':
        value = content.name;
        break;
      case 'ticket':
        value = content.name;
        break;
      case 'customer':
        value = content.firstName || content.primaryEmail;
        break;
      case 'company':
        value = content.primaryName;
        break;
    }

    return (
      <div>
        <ItemIndicator color="#AAAEB3" />
        {value}
      </div>
    );
  }

  render() {
    const { item, isDragging, provided } = this.props;

    return (
      <ItemContainer
        isDragging={isDragging}
        innerRef={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <Content onClick={this.toggleForm}>
          <h5>
            {renderPriority(item.priority)}
            {item.name}
          </h5>

          {this.renderInnerItem()}
          <PriceContainer>
            <Right>
              {(item.assignedUsers || []).map((user, index) => (
                <img
                  alt="Avatar"
                  key={index}
                  src={getUserAvatar(user)}
                  width="22px"
                  height="22px"
                  style={{ marginLeft: '2px', borderRadius: '11px' }}
                />
              ))}
            </Right>
          </PriceContainer>

          <Footer>
            {__('Last updated')}:
            <Right>{this.renderDate(item.modifiedAt)}</Right>
          </Footer>
        </Content>
        {this.renderForm()}
      </ItemContainer>
    );
  }
}
