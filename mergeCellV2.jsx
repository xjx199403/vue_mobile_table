export const createSortElement = function(h, sortClass, sortClickHander, index) {
    return (
            <span style='position:relative'  on-click={() => sortClickHander(index)}><a class={sortClass.sortClassUp}></a>
                <a class={sortClass.sortClassDown}></a></span>
    )
}

export const merge = function(h, cell, element) {
    return (
        <th class = {cell.sticky? 'sticky':''} colspan={cell.colspan} rowspan={cell.rowspan}><span>{cell.title}</span>{element}</th>
    )
}
export const slotElement = function(h, index) {
    return (
         <template><slot name={index}></slot></template>
    )
}
