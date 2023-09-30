import { AutoformatRule } from '@udecode/plate-autoformat';
import { ExitBreakRule } from '@udecode/plate-break';
import { PlatePlugin, PlatePluginComponent } from '@udecode/plate-common';
import { ResetNodePluginRule } from '@udecode/plate-reset-node';

export type Extension = {
	plugins?: PlatePlugin[];
	components?: { [key: string]: PlatePluginComponent };
	autoFormatRules?: AutoformatRule[];
	exitBreakRules?: ExitBreakRule[];
	resetNodeRules?: ResetNodePluginRule[];
};
