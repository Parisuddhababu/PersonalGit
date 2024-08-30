import React, { useCallback, useEffect, useState } from 'react';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Drag } from '@components/icons';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { DNDSlashNinjaOrderSort, DndSlashNinjaOrderSortableTableItem, SlashNinjaActivityList } from 'src/types/activities/slashNinja';

const SortableFlashcardActivityItem = ({ item }: DndSlashNinjaOrderSortableTableItem) => {
    const { id } = item;
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    return (

        <tr key={item.id} ref={setNodeRef} style={style}>
            <td className='cursor-default w-4'>
                <span {...listeners} {...attributes} className='py-1.5 px-3 border rounded mr-3 cursor-grab active:cursor-grabbing '>
                    <Drag className='opacity-50' />
                </span>
            </td>
            <td >
                <picture className='max-w-24 max-h-24'>
                    <img className='w-24 h-24' src={item.image} width={100} height={100} alt='preview' />
                </picture>
            </td>
        </tr>

    );
};

const DNDSlashNinja = ({ dndItemRow, setNewOrder }: DNDSlashNinjaOrderSort) => {
    const data = dndItemRow;
    const [items, setItems] = useState(dndItemRow);

    useEffect(() => {
        setItems(data);
    }, [data]);

    useEffect(() => {
        setNewOrder(items);
    }, [items]);

    const onDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id === over?.id) {
            return;
        }
        setItems((items: SlashNinjaActivityList[]) => {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over?.id);
            return arrayMove(items, oldIndex, newIndex);
        });
    }, []);

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd} modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                {items?.map((item, index) => (
                    <SortableFlashcardActivityItem key={item.id} item={item} index={index} />
                ))}
            </SortableContext>
        </DndContext>
    );
};

export default React.memo(DNDSlashNinja);
