
import React from 'react';
import { DragDropContext, Draggable, Droppable, OnDragEndResponder, DraggableProvided, DroppableProvided, Direction } from 'react-beautiful-dnd';
interface Item {
	id: string;
	name: string;
	type: string;
}
interface AppDraggableListProps<T> {
    droppableId: string;
    data: T[];
    onDragEnd: OnDragEndResponder;
    renderItem: (item: T, provided: DraggableProvided,index: number) => JSX.Element;
    renderWrapper: (
        children: JSX.Element,
        providedMain: DroppableProvided,
    ) => JSX.Element;
    direction?: Direction;
    disabled?:boolean;
}
const AppDraggableList = <T extends Item>({
  droppableId,
  data,
  onDragEnd,
  renderItem,
  renderWrapper,
  direction,
  disabled
}: AppDraggableListProps<T>) => (
  <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={droppableId} direction={direction}>
          {(providedMain) =>
              renderWrapper(
                  <>
                      {data.map((item, index) => (
                          <Draggable
                              key={item.id}
                              index={index}
                              draggableId={item.id.toString()}
                              isDragDisabled={disabled}
                          >
                              {(provided) => renderItem(item, provided, index)}
                          </Draggable>
                      ))}

                      {providedMain.placeholder}
                  </>,
                  providedMain
              )
          }
      </Droppable>
  </DragDropContext>
);

export default AppDraggableList;