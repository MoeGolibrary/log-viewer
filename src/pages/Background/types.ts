/*
 * @since 2024-09-29 15:23:14
 * @author junbao <junbao@moego.pet>
 */

import { JsonViewAction } from '../../shared/types';

export type Renderer = (action: JsonViewAction) => AsyncIterableIterator<string>;
