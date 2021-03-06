//  Copyright (C) 2011 Matsukei Co.,Ltd.
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.

goog.provide('thin.editor.AbstractTextGroup');

goog.require('thin.editor.AbstractBoxGroup');
goog.require('thin.editor.FontStyle');
goog.require('thin.editor.TextStyle');
goog.require('thin.core.Font');


/**
 * @param {Element} element
 * @param {thin.editor.Layout} layout
 * @constructor
 * @extends {thin.editor.AbstractBoxGroup}
 */
thin.editor.AbstractTextGroup = function(element, layout) {
  goog.base(this, element, layout);
  
  /**
   * @type {thin.editor.FontStyle}
   * @private
   */
  this.fontStyle_ = new thin.editor.FontStyle();
  
  /**
   * @type {thin.editor.TextStyle}
   * @private
   */
  this.textStyle_ = new thin.editor.TextStyle();
};
goog.inherits(thin.editor.AbstractTextGroup, thin.editor.AbstractBoxGroup);


/**
 * The latest fill applied to this element.
 * @type {goog.graphics.Fill?}
 * @protected
 */
thin.editor.AbstractTextGroup.prototype.fill = null;


/**
 * The latest stroke applied to this element.
 * @type {goog.graphics.Stroke?}
 * @private
 */
thin.editor.AbstractTextGroup.prototype.stroke_ = null;


/**
 * Sets the fill for this element.
 * @param {goog.graphics.Fill?} fill The fill object.
 */
thin.editor.AbstractTextGroup.prototype.setFill = function(fill) {
  this.fill = fill;
  this.getLayout().setElementFill(this, fill);
};


/**
 * @return {goog.graphics.Fill?} fill The fill object.
 */
thin.editor.AbstractTextGroup.prototype.getFill = function() {
  return this.fill;
};


/**
 * Sets the stroke for this element.
 * @param {goog.graphics.Stroke?} stroke The stroke object.
 */
thin.editor.AbstractTextGroup.prototype.setStroke = function(stroke) {
  this.stroke_ = stroke;
  this.getLayout().setElementStroke(this, stroke);
};


/**
 * @return {goog.graphics.Stroke?} stroke The stroke object.
 */
thin.editor.AbstractTextGroup.prototype.getStroke = function() {
  return this.stroke_;
};


/**
 * @param {number} size
 */
thin.editor.AbstractTextGroup.prototype.setFontSize = function(size) {
  this.getLayout().setElementAttributes(this.getElement(), {
    'font-size': size
  });
  this.fontStyle_.size = size;
};


/**
 * @param {string} family
 */
thin.editor.AbstractTextGroup.prototype.setFontFamily = function (family) {
  this.getLayout().setElementAttributes(this.getElement(), {
    'font-family': family
  });
  this.fontStyle_.family = family;
};


/**
 * @param {string} anchor
 */
thin.editor.AbstractTextGroup.prototype.setTextAnchor = function(anchor) {
  this.textStyle_.setTextAnchor(anchor);
  this.getLayout().setElementAttributes(this.getElement(), {
    'text-anchor': anchor
  });
};


/**
 * @param {string} valign
 */
thin.editor.AbstractTextGroup.prototype.setVerticalAlign = function(valign) {
  if (thin.isExactlyEqual(valign, thin.editor.TextStyle.DEFAULT_VALIGN)) {
    this.getElement().removeAttribute('x-valign');
  } else {
    this.getLayout().setElementAttributes(this.getElement(), {
      'x-valign': valign
    });
  }
  this.textStyle_.setVerticalAlign(valign);
};


/**
 * @param {string} ratio
 */
thin.editor.AbstractTextGroup.prototype.setTextLineHeightRatio = function(ratio) {
  var element = this.getElement();

  if (thin.isExactlyEqual(ratio, thin.editor.TextStyle.DEFAULT_LINEHEIGHT)) {
    element.removeAttribute('x-line-height');
    element.removeAttribute('x-line-height-ratio');
  } else {
    var layout = this.getLayout();
    var numRatio = Number(ratio);
    var heightAt = thin.core.Font.getHeight(this.getFontFamily(), this.getFontSize());

    layout.setElementAttributes(element, {
      'x-line-height': heightAt * numRatio
    });
    layout.setElementAttributes(element, {
      'x-line-height-ratio': numRatio
    });
  }
  this.textStyle_.setLineHeightRatio(ratio);
};


/**
 * @param {string} spacing
 */
thin.editor.AbstractTextGroup.prototype.setKerning = function(spacing) {
  if (thin.isExactlyEqual(spacing, thin.editor.TextStyle.DEFAULT_KERNING)) {
    this.getLayout().setElementAttributes(this.getElement(), {
      'kerning': thin.editor.TextStyle.DEFAULT_ELEMENT_KERNING
    });
  } else {
    this.getLayout().setElementAttributes(this.getElement(), {
      'kerning': spacing
    });
  }
  this.textStyle_.setKerning(spacing);
};


/**
 * @param {boolean} bold
 */
thin.editor.AbstractTextGroup.prototype.setFontBold = function(bold) {
  this.getLayout().setElementAttributes(this.getElement(), {
    'font-weight': bold ? 'bold' : 'normal'
  });
  this.fontStyle_.bold = bold;
};


/**
 * @param {boolean} italic
 */
thin.editor.AbstractTextGroup.prototype.setFontItalic = function(italic) {
  this.getLayout().setElementAttributes(this.getElement(), {
    'font-style': italic ? 'italic' : 'normal'
  });
  this.fontStyle_.italic = italic;
};


/**
 * @param {boolean} underline
 */
thin.editor.AbstractTextGroup.prototype.setFontUnderline = function(underline) {
  this.setTextDecoration(underline, this.isFontLinethrough());
};


/**
 * @param {boolean} linethrough
 */
thin.editor.AbstractTextGroup.prototype.setFontLinethrough = function(linethrough) {
  this.setTextDecoration(this.isFontUnderline(), linethrough);
};


/**
 * @param {boolean} underline
 * @param {boolean} linethrough
 */
thin.editor.AbstractTextGroup.prototype.setTextDecoration = function(underline, linethrough) {
  if (underline) {
    var decoration = linethrough ? 'underline line-through' : 'underline';
  } else {
    var decoration = linethrough ? 'line-through' : 'none';
  }
  this.fontStyle_.underline = underline;
  this.fontStyle_.linethrough = linethrough;
  this.fontStyle_.decoration = decoration;
  
  this.getLayout().setElementAttributes(this.getElement(), {
    'text-decoration': decoration
  });
};


/**
 * @return {number}
 */
thin.editor.AbstractTextGroup.prototype.getFontSize = function () {
  return this.fontStyle_.size;
};


/**
 * @return {string}
 */
thin.editor.AbstractTextGroup.prototype.getFontFamily = function() {
  return this.fontStyle_.family;
};


/**
 * @return {string}
 */
thin.editor.AbstractTextGroup.prototype.getTextAnchor = function() {
  return /** @type {string} */ (thin.getValIfNotDef(this.textStyle_.getTextAnchor(),
             thin.editor.TextStyle.HorizonAlignType.START));
};


/**
 * @return {string}
 */
thin.editor.AbstractTextGroup.prototype.getVerticalAlign = function() {
  return /** @type {string} */ (thin.getValIfNotDef(this.textStyle_.getVerticalAlign(),
             thin.editor.TextStyle.DEFAULT_VALIGN));
};


/**
 * @return {string}
 */
thin.editor.AbstractTextGroup.prototype.getTextLineHeightRatio = function() {
  return /** @type {string} */ (thin.getValIfNotDef(this.textStyle_.getLineHeightRatio(),
             thin.editor.TextStyle.DEFAULT_LINEHEIGHT));
};


/**
 * @return {string}
 */
thin.editor.AbstractTextGroup.prototype.getKerning = function() {
  return /** @type {string} */ (thin.getValIfNotDef(this.textStyle_.getKerning(), 
             thin.editor.TextStyle.DEFAULT_KERNING));
};


/**
 * @return {boolean}
 */
thin.editor.AbstractTextGroup.prototype.isAnchorEnd = function() {
  return this.textStyle_.isAnchorEnd();
};


/**
 * @return {boolean}
 */
thin.editor.AbstractTextGroup.prototype.isAnchorMiddle = function() {
  return this.textStyle_.isAnchorMiddle();
};


/**
 * @return {boolean}
 */
thin.editor.AbstractTextGroup.prototype.isVerticalBottom = function() {
  return this.textStyle_.isVerticalBottom();
};


/**
 * @return {boolean}
 */
thin.editor.AbstractTextGroup.prototype.isVerticalCenter = function() {
  return this.textStyle_.isVerticalCenter();
};


/**
 * @return {boolean}
 */
thin.editor.AbstractTextGroup.prototype.isFontBold = function() {
  return this.fontStyle_.bold;
};


/**
 * @return {boolean}
 */
thin.editor.AbstractTextGroup.prototype.isFontItalic = function() {
  return this.fontStyle_.italic;
};


/**
 * @return {boolean}
 */
thin.editor.AbstractTextGroup.prototype.isFontUnderline = function() {
  return this.fontStyle_.underline;
};


/**
 * @return {boolean}
 */
thin.editor.AbstractTextGroup.prototype.isFontLinethrough = function() {
  return this.fontStyle_.linethrough;
};


thin.editor.AbstractTextGroup.prototype.adjustToUiStatusForShape = function() {
  var workspace = this.getLayout().getWorkspace();
  var valign = this.getVerticalAlign();
  if (thin.isExactlyEqual(valign, thin.editor.TextStyle.DEFAULT_VALIGN)) {
    valign = thin.editor.TextStyle.VerticalAlignType.TOP;
  }

  workspace.setUiStatusForFontFamily(this.getFontFamily());
  workspace.setUiStatusForFontSize(this.getFontSize());
  workspace.setUiStatusForHorizonAlignType(this.getTextAnchor());
  workspace.setUiStatusForVerticalAlignType(valign);
  workspace.setUiStatusForBold(this.isFontBold());
  workspace.setUiStatusForUnderlIne(this.isFontUnderline());
  workspace.setUiStatusForLineThrough(this.isFontLinethrough());
  workspace.setUiStatusForItalic(this.isFontItalic());

  thin.ui.adjustToUiStatusForWorkspace();
};


/** @inheritDoc */
thin.editor.AbstractTextGroup.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  
  delete this.fontStyle_;
  delete this.textStyle_;
};