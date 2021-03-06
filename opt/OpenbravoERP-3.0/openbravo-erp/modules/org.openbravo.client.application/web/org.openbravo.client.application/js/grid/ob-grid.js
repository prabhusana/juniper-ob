/*
 *************************************************************************
 * The contents of this file are subject to the Openbravo  Public  License
 * Version  1.1  (the  "License"),  being   the  Mozilla   Public  License
 * Version 1.1  with a permitted attribution clause; you may not  use this
 * file except in compliance with the License. You  may  obtain  a copy of
 * the License at http://www.openbravo.com/legal/license.html
 * Software distributed under the License  is  distributed  on  an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
 * License for the specific  language  governing  rights  and  limitations
 * under the License.
 * The Original Code is Openbravo ERP.
 * The Initial Developer of the Original Code is Openbravo SLU
 * All portions are Copyright (C) 2010-2014 Openbravo SLU
 * All Rights Reserved.
 * Contributor(s):  ______________________________________.
 ************************************************************************
 */
isc.ClassFactory.defineClass('OBGrid', isc.ListGrid);

// = OBGrid =
// The OBGrid combines common grid functionality usefull for different 
// grid implementations.
isc.OBGrid.addProperties({

  reverseRTLAlign: true,
  dragTrackerMode: 'none',
  // recycle gives better performance but also results
  // in strange results that not all record components are
  // drawn when scrolling very fast
  recordComponentPoolingMode: 'viewport',

  showRecordComponentsByCell: true,
  recordComponentPosition: 'within',
  poolComponentsPerColumn: true,
  showRecordComponents: true,
  escapeHTML: true,
  bodyProperties: {
    canSelectText: true,

    // the redraw on change should not only redraw the current item
    // but the whole edit row, make sure that happens asynchronously
    redrawFormItem: function (item, reason) {
      var lg = this.grid,
          row = lg.getEditRow(),
          col = lg.getColNum(item.getFieldName());

      // If the user has edited the cell, or setValue() has been called on the item
      // we don't want a call to redraw() on the item to drop that value
      if (lg.getEditCol() === col) {
        lg.storeUpdatedEditorValue();
      }

      if (row === 0 || row > 0) {
        lg.fireOnPause('refreshEditRow', function () {
          lg.refreshRow(row);
        });
      }
    }
  },

  //prevent multi-line content to show strangely
  //https://issues.openbravo.com/view.php?id=17531, https://issues.openbravo.com/view.php?id=24878
  formatDisplayValue: function (value, record, rowNum, colNum) {
    var fld = this.getFields()[colNum],
        index;

    if (this.inCellHoverHTML || !isc.isA.String(value)) {
      return value;
    }

    index = value.indexOf('\n');
    if (index !== -1) {
      return value.substring(0, index) + '...';
    }

    return value;
  },

  cellHoverHTML: function (record, rowNum, colNum) {

    var ret, field = this.getField(colNum),
        cellErrors, msg = '',
        prefix = '',
        i, func = this.getGridSummaryFunction(field),
        isGroupOrSummary = record && (record[this.groupSummaryRecordProperty] || record[this.gridSummaryRecordProperty]);

    if (!record) {
      return;
    }

    if (func && (isGroupOrSummary)) {
      if (func === 'sum') {
        prefix = OB.I18N.getLabel('OBUIAPP_SummaryFunctionSum');
      }
      if (func === 'min') {
        prefix = OB.I18N.getLabel('OBUIAPP_SummaryFunctionMin');
      }
      if (func === 'max') {
        prefix = OB.I18N.getLabel('OBUIAPP_SummaryFunctionMax');
      }
      if (func === 'count') {
        prefix = OB.I18N.getLabel('OBUIAPP_SummaryFunctionCount');
      }
      if (func === 'avg') {
        prefix = OB.I18N.getLabel('OBUIAPP_SummaryFunctionAvg');
      }
      if (prefix) {
        prefix = prefix + ' ';
      }
    }

    if (this.isCheckboxField(field)) {
      return OB.I18N.getLabel('OBUIAPP_GridSelectColumnPrompt');
    }

    if (this.cellHasErrors(rowNum, colNum)) {
      cellErrors = this.getCellErrors(rowNum, colNum);
      // note cellErrors can be a string or array
      // accidentally both have the length property
      if (cellErrors && cellErrors.length > 0) {
        return OB.Utilities.getPromptString(cellErrors);
      }
    }
    if (record && record[isc.OBViewGrid.ERROR_MESSAGE_PROP]) {
      return record[isc.OBViewGrid.ERROR_MESSAGE_PROP];
    }

    this.inCellHoverHTML = true;
    ret = this.Super('cellHoverHTML', arguments);
    delete this.inCellHoverHTML;
    return prefix + (ret ? ret : '');
  },

  enableShortcuts: function () {
    var ksAction_FocusFilter, ksAction_FocusGrid, ksAction_ClearFilter, ksAction_SelectAll, ksAction_UnselectAll;

    ksAction_FocusFilter = function (caller) {
      caller.focusInFirstFilterEditor();
      return false; //To avoid keyboard shortcut propagation
    };
    OB.KeyboardManager.Shortcuts.set('Grid_FocusFilter', ['OBGrid.body', 'OBGrid.editForm'], ksAction_FocusFilter);

    ksAction_FocusGrid = function (caller) {
      if (caller.getPrototype().Class !== 'OBViewGrid' || caller.data.localData[0]) { // In OBViewGrid case, only execute action if there are at least one row in the grid
        caller.focus();
        if (!caller.getSelectedRecord()) { // If there are no rows already selected in the grid, select the first one
          caller.selectSingleRecord(0);
        }
      }
      return false; //To avoid keyboard shortcut propagation
    };
    OB.KeyboardManager.Shortcuts.set('Grid_FocusGrid', 'OBGrid.filter', ksAction_FocusGrid);

    ksAction_ClearFilter = function (caller) {
      caller.clearFilter(true);
      return false; //To avoid keyboard shortcut propagation
    };
    OB.KeyboardManager.Shortcuts.set('Grid_ClearFilter', ['OBGrid.body', 'OBGrid.filter', 'OBGrid.editForm'], ksAction_ClearFilter);

    ksAction_SelectAll = function (caller) {
      caller.selectAllRecords();
      return false; //To avoid keyboard shortcut propagation
    };
    OB.KeyboardManager.Shortcuts.set('Grid_SelectAll', 'OBGrid.body', ksAction_SelectAll);

    ksAction_UnselectAll = function (caller) {
      if (caller.getSelectedRecords().length > 1) {
        caller.deselectAllRecords();
      }
      return false; //To avoid keyboard shortcut propagation
    };
    OB.KeyboardManager.Shortcuts.set('Grid_UnselectAll', 'OBGrid.body', ksAction_UnselectAll);
  },

  draw: function () {
    this.enableShortcuts();
    this.Super('draw', arguments);
  },

  bodyKeyPress: function (event, eventInfo) {
    if (eventInfo && this.lastSelectedRecord && ((eventInfo.keyName === isc.OBViewGrid.ARROW_UP_KEY_NAME && this.data.localData && this.data.localData[0].id === this.lastSelectedRecord.id) || (eventInfo.keyName === isc.OBViewGrid.ARROW_DOWN_KEY_NAME && this.data.localData && this.data.localData[this.data.localData.length - 1] && this.data.localData[this.data.localData.length - 1].id === this.lastSelectedRecord.id))) {
      return true;
    }
    var response = OB.KeyboardManager.Shortcuts.monitor('OBGrid.body', this);
    if (response !== false) {
      response = this.Super('bodyKeyPress', arguments);
    }
    return response;
  },

  editFormKeyDown: function () {
    // Custom method. Only works if the form is an OBViewForm
    var response = OB.KeyboardManager.Shortcuts.monitor('OBGrid.editForm', this);
    if (response !== false) {
      response = this.Super('editFormKeyDown', arguments);
    }
    return response;
  },

  filterFieldsKeyDown: function (item, form, keyName) {
    // To fix issue https://issues.openbravo.com/view.php?id=21786
    var isEscape = isc.EH.getKey() === 'Escape' && !isc.EH.ctrlKeyDown() && !isc.EH.altKeyDown() && !isc.EH.shiftKeyDown(),
        response;
    if (isEscape && item && Object.prototype.toString.call(item.isPickListShown) === '[object Function]' && item.isPickListShown()) {
      return true; // Then the event will bubble to ComboBoxItem.keyDown
    }

    response = OB.KeyboardManager.Shortcuts.monitor('OBGrid.filter', this.grid.fieldSourceGrid);
    if (response !== false) {
      if (item.keyDownAction) {
        return item.keyDownAction(item, form, keyName);
      }
    }
    return response;
  },

  isEditing: function () {
    return this.getEditForm();
  },

  focusInFirstFilterEditor: function () {
    if (this.getFilterEditor() && this.getFilterEditor().getEditForm()) { // there is a filter editor
      var object = this.getFilterEditor().getEditForm(),
          items, item, i, length;

      // compute a focusable item
      items = object.getItems();
      length = items.length;
      for (i = 0; i < length; i++) {
        item = items[i];
        // The first filterable item (editorType!=='StaticTextItem') should be focused
        if (item.getCanFocus() && !item.isDisabled() && item.editorType !== 'StaticTextItem') {
          this.focusInFilterEditor(item);
          return true;
        }
      }
    }
    return false;
  },

  createRecordComponent: function (record, colNum) {
    var field = this.getField(colNum),
        rowNum = this.getRecordIndex(record),
        isSummary = record && (record[this.groupSummaryRecordProperty] || record[this.gridSummaryRecordProperty]),
        isEditRecord = rowNum === this.getEditRow(),
        canvas, clientClassArray, clientClass, clientClassProps, clientClassIsShownInGridEdit;

    if (isSummary) {
      return null;
    }

    if (field.isLink && !field.clientClass && record[field.name]) {
      // To keep compatibility with < 3.0MP20 versions that didn't implement 'clientClass' and only have 'isLink' property
      field.clientClass = 'OBGridLinkCellClick';
    }

    if (field.clientClass) {
      clientClassArray = OB.Utilities.clientClassSplitProps(field.clientClass);
      clientClass = clientClassArray[0];
      clientClassProps = clientClassArray[1];

      clientClassIsShownInGridEdit = new Function('return ' + clientClass + '.getInstanceProperty("isShownInGridEdit")')();

      if (!isEditRecord || clientClassIsShownInGridEdit) {
        canvas = isc.ClassFactory.newInstance(clientClass, {
          grid: this,
          align: this.getCellAlign(record, rowNum, colNum),
          field: field,
          record: record,
          rowNum: rowNum,
          colNum: colNum
        }, clientClassProps);
        if (canvas) {
          if (canvas.setRecord) {
            canvas.setRecord(record);
          }
          return canvas;
        }
      }
    }
    return null;
  },

  updateRecordComponent: function (record, colNum, component, recordChanged) {
    var field = this.getField(colNum),
        isSummary = record && (record[this.groupSummaryRecordProperty] || record[this.gridSummaryRecordProperty]),
        rowNum = this.getRecordIndex(record);

    if (isSummary) {
      return null;
    }

    if (field.clientClass) {
      component.align = this.getCellAlign(record, rowNum, colNum);
      component.field = field;
      component.record = record;
      component.rowNum = rowNum;
      component.colNum = colNum;
      if (component.setRecord) {
        component.setRecord(record);
      }
      return component;
    }
    return null;
  },

  // recompute RecordComponents
  recomputeCanvasComponents: function (rowNum) {
    var i, fld, length = this.getFields().length;

    // remove client record components in edit mode
    for (i = 0; i < length; i++) {
      fld = this.getFields()[i];
      if (fld.clientClass) {
        this.refreshRecordComponent(rowNum, i);
      }
    }
  },

  startEditing: function (rowNum, colNum, suppressFocus, eCe, suppressWarning) {
    var ret = this.Super('startEditing', arguments);
    this.recomputeCanvasComponents(rowNum);
    return ret;
  },

  startEditingNew: function (rowNum) {
    var ret = this.Super('startEditingNew', arguments);
    this.recomputeCanvasComponents(rowNum + 1);
    return ret;
  },

  formatLinkValue: function (record, field, colNum, rowNum, value) {
    if (typeof value === 'undefined' || value === null) {
      return '';
    }
    var simpleType = isc.SimpleType.getType(field.type, this.dataSource);
    // note: originalFormatCellValue is set in the initWidget below
    if (field && field.originalFormatCellValue) {
      return field.originalFormatCellValue(value, record, rowNum, colNum, this);
    } else if (simpleType.shortDisplayFormatter) {
      return simpleType.shortDisplayFormatter(value, field, this, record, rowNum, colNum);
    }
    return value;
  },

  filterEditorProperties: {

    // http://forums.smartclient.com/showthread.php?p=73107
    // https://issues.openbravo.com/view.php?id=18557
    showAllColumns: true,

    setEditValue: function (rowNum, colNum, newValue, suppressDisplay, suppressChange) {
      // prevent any setting of non fields in the filter editor
      // this prevents a specific issue that smartclient will set a value
      // in the {field.name} + OB.Constants.FIELDSEPARATOR + OB.Constants.IDENTIFIER (for example warehouse + OB.Constants.FIELDSEPARATOR + OB.Constants.IDENTIFIER)
      // because it thinks that the field does not have its own datasource
      if (isc.isA.String(colNum) && !this.getField(colNum)) {
        return;
      }
      return this.Super('setEditValue', arguments);
    },

    getValuesAsCriteria: function (advanced, textMatchStyle, returnNulls) {
      return this.Super('getValuesAsCriteria', [true, textMatchStyle, returnNulls]);
    },

    // is needed to display information in the checkbox field 
    // header in the filter editor row
    isCheckboxField: function () {
      return false;
    },

    // overridden for:
    // https://issues.openbravo.com/view.php?id=18509
    editorChanged: function (item) {
      var prop, same, opDefs, val = item.getElementValue(),
          actOnKeypress = item.actOnKeypress === true ? item.actOnKeypress : this.actOnKeypress,
          grid = this.parentElement;

      if (this.sourceWidget.allowFilterExpressions && val && actOnKeypress) {

        // if someone starts typing and and or then do not filter
        // onkeypress either
        if (val.contains(' and') || val.contains(' or ')) {
          this.preventPerformFilterFiring();
          return;
        }

        if (val.startsWith('=')) {
          this.preventPerformFilterFiring();
          return;
        }

        // now check if the item element value is only
        // an operator, if so, go away
        opDefs = isc.DataSource.getSearchOperators();
        for (prop in opDefs) {
          if (opDefs.hasOwnProperty(prop)) {

            // let null and not null fall through
            // as they should be filtered
            if (prop === 'isNull' || prop === 'notNull') {
              continue;
            }

            same = opDefs[prop].symbol && val.startsWith(opDefs[prop].symbol);
            if (same) {
              this.preventPerformFilterFiring();
              return;
            }
          }
        }
      }

      if (item.thresholdToFilter && item.thresholdToFilter > grid.fetchDelay) {
        this.currentThresholdToFilter = item.thresholdToFilter;
      } else {
        delete this.currentThresholdToFilter;
      }

      if (grid && grid.lazyFiltering) {
        grid.filterHasChanged = true;
        grid.sorter.enable();
      }
      return this.Super('editorChanged', arguments);
    },


    // function called to clear any pending performFilter calls
    // earlier type actions can already have pending filter actions
    // this deletes them
    preventPerformFilterFiring: function () {
      this.fireOnPause('performFilter', {}, this.fetchDelay);
    },

    // If the criteria contains an 'or' operator due to the changes made for solving
    // issue 20722 (https://issues.openbravo.com/view.php?id=20722), remove the criteria
    // that makes reference to a specific id and return the original one
    removeSpecificIdFilter: function (criteria) {
      var i, length;
      if (!criteria) {
        return criteria;
      }
      if (criteria.operator !== 'or') {
        return criteria;
      }
      if (criteria.criteria && criteria.criteria.length < 2) {
        return criteria;
      }
      // The original criteria is in the position 0, the rest are specific ids
      length = criteria.criteria.length;
      for (i = 1; i < length; i++) {
        if (criteria.criteria.get(i).fieldName !== 'id') {
          return criteria;
        }
      }
      return criteria.criteria.get(0);
    },

    // repair that filter criteria on fk fields can be 
    // on the identifier instead of the field itself.
    // after applying the filter the grid will set the criteria
    // back in the filtereditor effectively clearing
    // the filter field. The code here repairs/prevents this.
    setValuesAsCriteria: function (criteria, refresh) {
      // create an edit form right away
      if (!this.getEditForm()) {
        this.makeEditForm();
      }
      var prop, fullPropName;
      // make a copy so that we don't change the object
      // which is maybe used somewhere else
      criteria = criteria ? isc.clone(criteria) : {};
      // If a criterion has been added to include the selected record, remove it
      // See issue https://issues.openbravo.com/view.php?id=20722
      criteria = this.removeSpecificIdFilter(criteria);
      var internCriteria = criteria.criteria;
      if (internCriteria && this.getEditForm()) {
        // now remove anything which is not a field
        // otherwise smartclient will keep track of them and send them again
        var fields = this.getEditForm().getFields(),
            length = fields.length,
            i;
        for (i = internCriteria.length - 1; i >= 0; i--) {
          prop = internCriteria[i].fieldName;
          // happens when the internCriteria[i], is again an advanced criteria
          if (!prop) {
            continue;
          }
          fullPropName = prop;
          if (prop.endsWith(OB.Constants.FIELDSEPARATOR + OB.Constants.IDENTIFIER)) {
            var index = prop.lastIndexOf(OB.Constants.FIELDSEPARATOR);
            prop = prop.substring(0, index);
          }
          var fnd = false,
              j;
          for (j = 0; j < length; j++) {
            if (fields[j].displayField === fullPropName || fields[j].criteriaField === fullPropName) {
              fnd = true;
              break;
            }
            if (fields[j].name === prop) {
              internCriteria[i].fieldName = prop;
              fnd = true;
              break;
            }
            if (fields[j].name === fullPropName) {
              fnd = true;
              break;
            }
          }
          if (!fnd) {
            internCriteria.removeAt(i);
          }
        }
      }
      return this.Super('setValuesAsCriteria', [criteria, refresh]);
    },

    // the filtereditor will assign the grids datasource to a field
    // if it has a display field and no datasource
    // prevent this as we get the datasource later it is not 
    // yet set
    getEditorProperties: function (field) {
      var noDataSource = !field.optionDataSource,
          ret = this.Super('getEditorProperties', arguments);
      if (ret.optionDataSource && noDataSource) {
        delete ret.optionDataSource;
      }
      return ret;
    },

    actionButtonProperties: {
      baseStyle: 'OBGridFilterFunnelIcon',
      visibility: 'hidden',
      showFocused: false,
      showDisabled: false,
      prompt: OB.I18N.getLabel('OBUIAPP_GridFilterIconToolTip'),
      initWidget: function () {
        this.recordEditor.sourceWidget.filterImage = this;
        this.recordEditor.filterImage = this;
        if (this.recordEditor.sourceWidget.filterClause || this.recordEditor.sourceWidget.sqlFilterClause) {
          this.prompt = OB.I18N.getLabel('OBUIAPP_GridFilterImplicitToolTip');
          this.visibility = 'inherit';
        }
        this.Super('initWidget', arguments);
      },
      click: function () {
        this.recordEditor.sourceWidget.clearFilter();
      }
    }
  },

  initWidget: function () {
    // prevent the value to be displayed in case of a clientClass
    var i, length, field, formatCellValueFunction, OBAbsoluteTimeItem_FormatCellValueFunction, OBAbsoluteDateTimeItem_FormatCellValueFunction;

    formatCellValueFunction = function (value, record, rowNum, colNum, grid) {
      return '';
    };

    OBAbsoluteTimeItem_FormatCellValueFunction = function (value, record, rowNum, colNum, grid) {
      var newValue = value,
          format = isc.OBAbsoluteTimeItem.getPrototype().timeFormatter;
      if (Object.prototype.toString.call(newValue) === '[object String]') {
        newValue = isc.Time.parseInput(newValue);
      }
      newValue = OB.Utilities.Date.addTimezoneOffset(newValue);
      newValue = isc.Time.format(newValue, format);
      return newValue;
    };

    OBAbsoluteDateTimeItem_FormatCellValueFunction = function (value, record, rowNum, colNum, grid) {
      var newValue = value;
      newValue = OB.Utilities.Date.addTimezoneOffset(newValue);
      var showTime = false;
      if (this.editorType && new Function('return isc.' + this.editorType + '.getPrototype().showTime')()) {
        showTime = true;
      }

      return OB.Utilities.Date.JSToOB(newValue, (showTime ? OB.Format.dateTime : OB.Format.date));
    };

    if (this.fields) {
      length = this.fields.length;
      for (i = 0; i < length; i++) {
        field = this.fields[i];

        if (!field.filterEditorProperties) {
          field.filterEditorProperties = {};
        }

        field.filterEditorProperties.keyDown = this.filterFieldsKeyDown;

        if (field.criteriaField) {
          field.filterEditorProperties.criteriaField = field.criteriaField;
        }

        if (field.editorType && new Function('return isc.' + field.editorType + '.getPrototype().isAbsoluteTime')()) {
          // In the case of an absolute time, the time needs to be converted in order to avoid the UTC conversion
          // http://forums.smartclient.com/showthread.php?p=116135
          field.formatCellValue = OBAbsoluteTimeItem_FormatCellValueFunction;
        }

        if (field.editorType && new Function('return isc.' + field.editorType + '.getPrototype().isAbsoluteDateTime')()) {
          // In the case of an absolute datetime, the JS date needs to be converted in order to avoid the UTC conversion
          // http://forums.smartclient.com/showthread.php?p=116135
          field.formatCellValue = OBAbsoluteDateTimeItem_FormatCellValueFunction;
        }

        if (field.clientClass) {
          // store the originalFormatCellValue if not already set
          if (field.formatCellValue && !field.formatCellValueFunctionReplaced) {
            field.originalFormatCellValue = field.formatCellValue;
          }
          field.formatCellValueFunctionReplaced = true;
          field.formatCellValue = formatCellValueFunction;
        }
      }
    }

    if (this.lazyFiltering) {
      this.showSortArrow = isc.ListGrid.BOTH;
      this.sorterDefaults = {
        click: function () {
          var grid = this.parentElement;
          if (!this._iconEnabled) {
            return;
          }
          if (grid.filterHasChanged) {
            // Do not change the sorting after receiving the data from the datasource
            grid._filteringAndSortingManually = true;
            grid.filterEditor.performFilter(true, true);
            delete grid.filterHasChanged;
            delete grid.sortingHasChanged;
            delete grid._filteringAndSortingManually;
          } else if (!isc.isA.ResultSet(grid.data)) {
            // The initial data has not been loaded yet, refreshGrid
            // refreshGrid applies also the current sorting
            grid.refreshGrid();
            delete grid.sortingHasChanged;
          } else if (grid.sortingHasChanged) {
            grid.setSort(grid.savedSortSpecifiers, true);
            delete grid.sortingHasChanged;
          }
          if (grid && grid.sorter) {
            grid.sorter.disable();
          }
        },
        disable: function () {
          this.setIcon(OB.Styles.skinsPath + 'Default/org.openbravo.client.application/images/grid/applyPendingChanges_Disabled.png');
          this._iconEnabled = false;
        },
        enable: function () {
          this.setIcon(OB.Styles.skinsPath + 'Default/org.openbravo.client.application/images/grid/applyPendingChanges.png');
          this._iconEnabled = true;
        },
        align: 'center',
        prompt: OB.I18N.getLabel('OBUIAPP_ApplyFilters'),
        iconWidth: 10,
        iconHeight: 10,
        icon: OB.Styles.skinsPath + 'Default/org.openbravo.client.application/images/grid/applyPendingChanges.png',
        _iconEnabled: true
      };
    }

    this.Super('initWidget', arguments);
  },

  clearFilter: function (keepFilterClause, noPerformAction) {
    var i = 0,
        fld, length, groupState, forceRefresh;
    if (this.lazyFiltering) {
      noPerformAction = true;
      if (this.sorter) {
        this.filterHasChanged = true;
        this.sorter.enable();
      }
    }
    if (!keepFilterClause) {
      // forcing fetch from server in case default filters are removed, in other
      // cases adaptive filtering can be used if possible
      if (this.data) {
        forceRefresh = this.filterClause || this.sqlFilterClause;

        groupState = this.getGroupState();
        if (forceRefresh && groupState && groupState.groupByFields) {
          // in case of field grouping and filter clause, remove filter grouping
          // because when filter clause is removed data could be bigger than the
          // amount allowed by grouping
          this.setGroupState(null);
        }

        this.data.forceRefresh = forceRefresh;
        if (this.data.context && this.data.context.params) {
          delete this.data.context.params._where;
        }
      }

      delete this.filterClause;
      delete this.sqlFilterClause;
    }

    if (this.filterEditor) {
      if (this.filterEditor.getEditForm()) {
        this.filterEditor.getEditForm().clearValues();

        // clear the date values in a different way
        length = this.filterEditor.getEditForm().getFields().length;

        for (i = 0; i < length; i++) {
          fld = this.filterEditor.getEditForm().getFields()[i];
          if (fld.clearFilterValues) {
            fld.clearFilterValues();
          }
        }
      } else {
        this.filterEditor.setValuesAsCriteria(null);
      }
    }
    if (!noPerformAction) {
      this.filterEditor.performAction();
    }
    if (this.view && this.view.directNavigation) {
      delete this.view.directNavigation;
    }
  },

  showSummaryRow: function () {
    var i, fld, fldsLength, newFields = [];
    var ret = this.Super('showSummaryRow', arguments);
    if (this.summaryRow && !this.summaryRowFieldRepaired) {
      // the summaryrow shares the same field instances as the 
      // original grid, this must be repaired as the grid and
      // and the summary row need different behavior.
      // copy the fields and repair specific parts
      // don't support links in the summaryrow
      fldsLength = this.summaryRow.fields.length;
      for (i = 0; i < fldsLength; i++) {
        fld = isc.addProperties({}, this.summaryRow.fields[i]);
        newFields[i] = fld;
        fld.isLink = false;
        if (fld.originalFormatCellValue) {
          fld.formatCellValue = fld.originalFormatCellValue;
          fld.originalFormatCellValue = null;
        } else {
          fld.formatCellValue = null;
        }
      }
      this.summaryRow.isSummaryRow = true;
      this.summaryRowFieldRepaired = true;
      this.summaryRow.setFields(newFields);
    }
    return ret;
  },

  // show or hide the filter button
  filterEditorSubmit: function (criteria) {
    this.checkShowFilterFunnelIcon(criteria);
  },

  setSingleRecordFilterMessage: function () {
    var showMessageProperty, showMessage;

    if (!this.isOpenDirectModeLeaf && !this.view.isShowingForm && (this.view.messageBar && !this.view.messageBar.isVisible())) {
      showMessageProperty = OB.PropertyStore.get('OBUIAPP_ShowSingleRecordFilterMsg');
      showMessage = showMessageProperty !== 'N' && showMessageProperty !== '"N"';
      if (showMessage) {
        this.view.messageBar.setMessage(isc.OBMessageBar.TYPE_INFO, '<div><div style="float: left;">' + OB.I18N.getLabel('OBUIAPP_SingleRecordFilterMsg') + '<br/>' + OB.I18N.getLabel('OBUIAPP_ClearFilters') + '</div><div style="float: right; padding-top: 15px;"><a href="#" style="font-weight:normal; color:inherit;" onclick="' + 'window[\'' + this.view.messageBar.ID + '\'].hide(); OB.PropertyStore.set(\'OBUIAPP_ShowSingleRecordFilterMsg\', \'N\');">' + OB.I18N.getLabel('OBUIAPP_NeverShowMessageAgain') + '</a></div></div>', ' ');
        this.view.messageBar.hasFilterMessage = true;
      }
    } else if (this.isOpenDirectModeLeaf && this.view.messageBar.hasFilterMessage) {
      // remove grid message if it was set previously when in direct open
      this.view.messageBar.hasFilterMessage = false;
      this.view.messageBar.hide();
    }
  },

  checkShowFilterFunnelIcon: function (criteria) {
    if (!this.filterImage) {
      return;
    }
    var gridIsFiltered = this.isGridFiltered(criteria);
    var noParentOrParentSelected = !this.view || !this.view.parentView || (this.view.parentView.viewGrid.getSelectedRecords() && this.view.parentView.viewGrid.getSelectedRecords().length > 0);

    if (this.view && this.view.directNavigation) {
      this.filterImage.prompt = OB.I18N.getLabel('OBUIAPP_GridFilterSingleRecord');
      this.filterImage.show(true);
      this.setSingleRecordFilterMessage();
      return;
    } else if (this.filterClause && gridIsFiltered) {
      this.filterImage.prompt = OB.I18N.getLabel('OBUIAPP_GridFilterBothToolTip');
      this.filterImage.show(true);
    } else if (this.filterClause) {
      this.filterImage.prompt = OB.I18N.getLabel('OBUIAPP_GridFilterImplicitToolTip');
      this.filterImage.show(true);
    } else if (gridIsFiltered) {
      this.filterImage.prompt = OB.I18N.getLabel('OBUIAPP_GridFilterExplicitToolTip');
      this.filterImage.show(true);
    } else {
      this.filterImage.prompt = OB.I18N.getLabel('OBUIAPP_GridFilterIconToolTip');
      if (this.view && this.view.messageBar && this.view.messageBar.hasFilterMessage) {
        this.view.messageBar.hide();
      }
      this.filterImage.hide();
    }

    if (this.filterClause && !this.view.isShowingForm && (this.view.messageBar && !this.view.messageBar.isVisible())) {
      var showMessageProperty = OB.PropertyStore.get('OBUIAPP_ShowImplicitFilterMsg'),
          showMessage = (showMessageProperty !== 'N' && showMessageProperty !== '"N"' && noParentOrParentSelected);
      if (showMessage) {
        this.view.messageBar.setMessage(isc.OBMessageBar.TYPE_INFO, '<div><div class="' + OB.Styles.MessageBar.leftMsgContainerStyle + '">' + this.filterName + '<br/>' + OB.I18N.getLabel('OBUIAPP_ClearFilters') + '</div><div class="' + OB.Styles.MessageBar.rightMsgContainerStyle + '"><a href="#" class="' + OB.Styles.MessageBar.rightMsgTextStyle + '" onclick="' + 'window[\'' + this.view.messageBar.ID + '\'].hide(); OB.PropertyStore.set(\'OBUIAPP_ShowImplicitFilterMsg\', \'N\');">' + OB.I18N.getLabel('OBUIAPP_NeverShowMessageAgain') + '</a></div></div>', ' ');
        this.view.messageBar.hasFilterMessage = true;
      }
    }
  },

  isGridFiltered: function (criteria) {
    if (!this.filterEditor) {
      return false;
    }
    if (this.filterClause) {
      return true;
    }
    if (!criteria) {
      return false;
    }
    return this.isGridFilteredWithCriteria(criteria.criteria);
  },

  isGridFilteredWithCriteria: function (criteria) {
    var i, length;
    if (!criteria) {
      return false;
    }
    length = criteria.length;
    for (i = 0; i < length; i++) {
      var criterion = criteria[i];
      var prop = criterion && criterion.fieldName;
      var fullPropName = prop;
      if (!prop) {
        if (this.isGridFilteredWithCriteria(criterion.criteria)) {
          return true;
        }
        continue;
      }
      var value = criterion.value;
      // see the description in setValuesAsCriteria above
      var separatorIndex = prop.lastIndexOf(OB.Constants.FIELDSEPARATOR);
      if (separatorIndex !== -1) {
        prop = prop.substring(0, separatorIndex);
      }
      var field = this.filterEditor.getField(prop);
      // criterion.operator is set in case of an and/or expression
      if (this.isValidFilterField(field) && (criterion.operator || value === false || value || value === 0)) {
        return true;
      }

      field = this.filterEditor.getField(fullPropName);
      // criterion.operator is set in case of an and/or expression
      if (this.isValidFilterField(field) && (criterion.operator || value === false || value || value === 0)) {
        return true;
      }
    }
    return false;
  },

  isValidFilterField: function (field) {
    if (!field) {
      return false;
    }
    return !field.name.startsWith('_') && field.canFilter;
  },

  // the valuemap is updated in the form item, make sure that the
  // grid field also has it
  getEditorValueMap: function (field, values) {
    var form, ret = this.Super('getEditorValueMap', arguments);
    if (!ret) {
      if (this.getEditForm()) {
        form = this.getEditForm();
        if (form.getItem(field.name) && form.getItem(field.name).valueMap) {
          return form.getItem(field.name).valueMap;
        }
      }
    }
    return ret;
  },

  // = exportData =
  // The exportData function exports the data of the grid to a file. The user will 
  // be presented with a save-as dialog.
  // Parameters:
  // * {{{exportProperties}}} defines different properties used for controlling the export, currently only the 
  // exportProperties.exportAs and exportProperties._extraProperties are supported (which is defaulted to csv).
  // * {{{data}}} the parameters to post to the server, in addition the filter criteria of the grid are posted.  
  exportData: function (exportProperties, data) {
    var d = data || {},
        expProp = exportProperties || {},
        dsURL = this.dataSource.dataURL;
    var sortCriteria;
    var lcriteria = this.getCriteria();
    var gdata = this.getData(),
        isExporting = true;
    if (gdata && gdata.dataSource) {
      lcriteria = gdata.dataSource.convertRelativeDates(lcriteria);
    }

    isc.addProperties(d, {
      _dataSource: this.dataSource.ID,
      _operationType: 'fetch',
      _noCount: true,
      // never do count for export
      exportAs: expProp.exportAs || 'csv',
      viewState: expProp.viewState,
      _extraProperties: expProp._extraProperties,
      tab: expProp.tab,
      exportToFile: true,
      _textMatchStyle: 'substring',
      _UTCOffsetMiliseconds: OB.Utilities.Date.getUTCOffsetInMiliseconds()
    }, lcriteria, this.getFetchRequestParams(null, isExporting));
    if (this.getSortField()) {
      sortCriteria = this.getSort();
      if (sortCriteria && sortCriteria.length > 0) {
        d._sortBy = sortCriteria[0].property;
        if (sortCriteria[0].direction === 'descending') {
          d._sortBy = '-' + d._sortBy;
        }
      }
    }
    OB.Utilities.postThroughHiddenForm(dsURL, d);
  },

  getFetchRequestParams: function (params) {
    return params;
  },

  editorKeyDown: function (item, keyName) {
    if (item) {
      if (typeof item.keyDownAction === 'function') {
        item.keyDownAction();
      }
    }
    return this.Super('editorKeyDown', arguments);
  },

  // Prevents empty message to be shown in frozen part
  // http://forums.smartclient.com/showthread.php?p=57581
  createBodies: function () {
    var ret = this.Super('createBodies', arguments);
    if (this.frozenBody) {
      this.frozenBody.showEmptyMessage = false;
    }
    return ret;
  },

  //= getErrorRows =
  // Returns all the rows that have errors.
  getErrorRows: function () {
    var editRows, errorRows = [],
        i, length;

    if (this.hasErrors()) {
      editRows = this.getAllEditRows(true);
      length = editRows.length;
      for (i = 0; i < length; i++) {
        if (this.rowHasErrors(editRows[i])) {
          errorRows.push(editRows[i]);
        }
      }
    }
    return errorRows;
  },


  // Does not apply if the grid is filtering lazily
  setSort: function (sortSpecifiers, forceSort) {
    if (!forceSort && this.lazyFiltering) {
      this.sortingHasChanged = true;
      if (this.sorter) {
        this.sorter.enable();
      }
      this.savedSortSpecifiers = isc.shallowClone(sortSpecifiers);
      // Refresh the header button titles
      this.refreshHeaderButtons();
    } else {
      this.Super('setSort', arguments);
    }
  },

  refreshHeaderButtons: function () {
    var i, headerButton;
    for (i = 0; i < this.fields.length; i++) {
      headerButton = this.getFieldHeaderButton(i);
      if (headerButton) {
        headerButton.setTitle(headerButton.getTitle());
      }
    }
  },

  getSortFieldCount: function () {
    if (this.lazyFiltering) {
      if (this.savedSortSpecifiers) {
        return this.savedSortSpecifiers.length;
      } else {
        return 0;
      }
    } else {
      return this.Super('getSortFieldCount', arguments);
    }
  },

  toggleSort: function (fieldName, direction) {
    var fullIdentifierName = fieldName + OB.Constants.FIELDSEPARATOR + OB.Constants.IDENTIFIER;
    if (this.lazyFiltering) {
      this.sortingHasChanged = true;
      // If the user clicks on a column that is already ordered, reverse the sort direction
      if (this.savedSortSpecifiers && this.savedSortSpecifiers.length > 0) {
        if (this.savedSortSpecifiers[0].property === fieldName || this.savedSortSpecifiers[0].property === fullIdentifierName) {
          if (this.savedSortSpecifiers[0].direction === 'ascending') {
            this.savedSortSpecifiers[0].direction = 'descending';
          } else {
            this.savedSortSpecifiers[0].direction = 'ascending';
          }
        }
        if (this.sorter) {
          this.sorter.enable();
        }
        this.refreshHeaderButtons();
      }
    } else {
      this.Super('toggleSort', arguments);
    }
  },

  getSort: function () {
    if (this.lazyFiltering) {
      return this.savedSortSpecifiers;
    } else {
      return this.Super('getSort', arguments);
    }
  },

  // If the grid is lazy filtering, a field will be considered ordered if it is saved in savedSortSpecifiers
  isSortField: function (fieldName) {
    var i, len, fullIdentifierName = fieldName + OB.Constants.FIELDSEPARATOR + OB.Constants.IDENTIFIER;
    if (this.lazyFiltering) {
      if (!this.savedSortSpecifiers) {
        return false;
      } else {
        //Search for the fieldName in the savedSortSpecifiers
        len = this.savedSortSpecifiers.length;
        for (i = 0; i < len; i++) {
          if (this.savedSortSpecifiers[i].property === fieldName || this.savedSortSpecifiers[0].property === fullIdentifierName) {
            return true;
          }
        }
        return false;
      }
    } else {
      return this.Super('isSortField', arguments);
    }
  },

  getSortArrowImage: function (fieldNum) {
    var sortDirection, field = this.getField(fieldNum),
        fullIdentifierName;

    if (this.lazyFiltering) {
      if (!field) {
        return isc.Canvas.spacerHTML(1, 1);
      }
      fullIdentifierName = field.name + OB.Constants.FIELDSEPARATOR + OB.Constants.IDENTIFIER;
      if (this.savedSortSpecifiers && this.savedSortSpecifiers.length > 0) {
        if (this.savedSortSpecifiers[0].property === field.name || this.savedSortSpecifiers[0].property === fullIdentifierName) {
          sortDirection = this.savedSortSpecifiers[0].direction;
        }
      }
      if (sortDirection) {
        return this.imgHTML(Array.shouldSortAscending(sortDirection) ? this.sortAscendingImage : this.sortDescendingImage, null, null, null, null, this.widgetImgDir);
      } else {
        return isc.Canvas.spacerHTML(1, 1);
      }
    } else {
      return this.Super('getSortArrowImage', arguments);
    }

  }
});

isc.ClassFactory.defineClass('OBGridSummary', isc.OBGrid);

isc.OBGridSummary.addProperties({
  getCellStyle: function (record, rowNum, colNum) {
    var field = this.parentElement.getField(colNum);
    if (field.summaryFunction && this['summaryRowStyle_' + field.summaryFunction]) {
      return this['summaryRowStyle_' + field.summaryFunction];
    } else {
      return this.summaryRowStyle;
    }
  }
});

isc.ClassFactory.defineClass('OBGridHeaderImgButton', isc.ImgButton);

isc.ClassFactory.defineClass('OBGridLinkItem', isc.HLayout);
isc.OBGridLinkItem.addProperties({
  overflow: 'clip-h',
  btn: null,
  height: 1,
  width: '100%',

  isShownInGridEdit: true,
  initWidget: function () {
    if (!this.btn) {
      this.btn = isc.OBGridLinkButton.create({});
    }
    this.setTitle(this.title);
    this.btn.owner = this;
    this.addMember(this.btn);
    this.Super('initWidget', arguments);
  },

  setTitle: function (title) {
    this.btn.setTitle(title);
  }
});

isc.ClassFactory.defineClass('OBGridLinkButton', isc.Button);

isc.OBGridLinkButton.addProperties({
  action: function () {
    this.owner.doAction();
  }
});

isc.ClassFactory.defineClass('OBGridFormButton', isc.OBFormButton);
isc.OBGridFormButton.addProperties({});


isc.defineClass('OBGridLinkCellClick', isc.OBGridLinkItem);

isc.OBGridLinkCellClick.addProperties({
  setRecord: function () {
    this.setTitle(this.grid.formatLinkValue(this.record, this.field, this.colNum, this.rowNum, this.record[this.field.name]));
  },

  doAction: function () {
    if (this.grid && this.grid.doCellClick) {
      this.grid.doCellClick(this.record, this.rowNum, this.colNum);
    } else if (this.grid && this.grid.cellClick) {
      this.grid.cellClick(this.record, this.rowNum, this.colNum);
    }
  }
});