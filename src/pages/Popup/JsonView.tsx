/*
 * @since 2024-09-27 20:13:09
 * @author junbao <junbao@moego.pet>
 */

import React, { memo, useMemo } from 'react';
import { JsonViewAction } from '../Content';

let id = 0;

function prettyJson(value: any, map: Map<number, string>, depth: number) {
  const str = JSON.stringify(
    value,
    (key, value1) => {
      if (typeof value !== 'string' || !/^[[{]/.test(value)) {
        return value1;
      }
      try {
        const json = JSON.parse(value1);
        const uid = ++id;
        map.set(uid, prettyJson(json, map, depth + 1));
        return `$__${uid}__$`;
      } catch {
        return value1;
      }
    },
    2
  );
  const indent = '  '.repeat((depth + 1) * 2);
  return str
    .replace(/\$__(\d+)__\$/g, ($0, $1) => {
      const v = map.get(+$1) || '';
      return v.replace(/\n/g, indent);
    })
    .replace(/\\n/g, '\n' + indent + '  ')
    .replace(/\\t/g, '  ');
}

export const JsonView = memo<JsonViewAction>(({ content }) => {
  const json = useMemo(() => {
    let data = content;
    const tempMap = new Map<number, string>();
    try {
      data = prettyJson(JSON.parse(data), tempMap, 0);
    } catch {
      data = data.replace(/-(?=[,}\]])/g, '-0');
      try {
        data = prettyJson(JSON.parse(data), tempMap, 0);
      } catch {}
    }
    return data;
  }, [content]);
  return (
    <div
      style={{
        padding: '20px',
      }}
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
});
