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
 * All portions are Copyright (C) 2008-2014 Openbravo SLU
 * All Rights Reserved.
 * Contributor(s):  ______________________________________.
 ************************************************************************
*/
package org.openbravo.model.common.plm;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.openbravo.base.structure.ActiveEnabled;
import org.openbravo.base.structure.BaseOBObject;
import org.openbravo.base.structure.ClientEnabled;
import org.openbravo.base.structure.OrganizationEnabled;
import org.openbravo.base.structure.Traceable;
import org.openbravo.model.ad.access.User;
import org.openbravo.model.ad.system.Client;
import org.openbravo.model.common.enterprise.Organization;
/**
 * Entity class for entity AttributeValue (stored in table M_AttributeValue).
 *
 * NOTE: This class should not be instantiated directly. To instantiate this
 * class the {@link org.openbravo.base.provider.OBProvider} should be used.
 */
public class AttributeValue extends BaseOBObject implements Traceable, ClientEnabled, OrganizationEnabled, ActiveEnabled {
    private static final long serialVersionUID = 1L;
    public static final String TABLE_NAME = "M_AttributeValue";
    public static final String ENTITY_NAME = "AttributeValue";
    public static final String PROPERTY_ID = "id";
    public static final String PROPERTY_CLIENT = "client";
    public static final String PROPERTY_ORGANIZATION = "organization";
    public static final String PROPERTY_ACTIVE = "active";
    public static final String PROPERTY_CREATIONDATE = "creationDate";
    public static final String PROPERTY_CREATEDBY = "createdBy";
    public static final String PROPERTY_UPDATED = "updated";
    public static final String PROPERTY_UPDATEDBY = "updatedBy";
    public static final String PROPERTY_ATTRIBUTE = "attribute";
    public static final String PROPERTY_SEARCHKEY = "searchKey";
    public static final String PROPERTY_NAME = "name";
    public static final String PROPERTY_DESCRIPTION = "description";
    public static final String PROPERTY_DTPOITEMNO = "dtpoItemno";
    public static final String PROPERTY_DTPOMAKE = "dtpoMake";
    public static final String PROPERTY_DTPOMODEL = "dtpoModel";
    public static final String PROPERTY_DTPOHSNCODE = "dtpoHsncode";
    public static final String PROPERTY_DTPOCOUNTRYOFORIGIN = "dtpoCountryoforigin";
    public static final String PROPERTY_DTPOPORTOFLOADING = "dtpoPortofloading";
    public static final String PROPERTY_DTPOUOM = "dtpoUom";
    public static final String PROPERTY_DTPOAREA = "dtpoArea";
    public static final String PROPERTY_ATTRIBUTEINSTANCELIST = "attributeInstanceList";

    public AttributeValue() {
        setDefaultValue(PROPERTY_ACTIVE, true);
        setDefaultValue(PROPERTY_ATTRIBUTEINSTANCELIST, new ArrayList<Object>());
    }

    @Override
    public String getEntityName() {
        return ENTITY_NAME;
    }

    public String getId() {
        return (String) get(PROPERTY_ID);
    }

    public void setId(String id) {
        set(PROPERTY_ID, id);
    }

    public Client getClient() {
        return (Client) get(PROPERTY_CLIENT);
    }

    public void setClient(Client client) {
        set(PROPERTY_CLIENT, client);
    }

    public Organization getOrganization() {
        return (Organization) get(PROPERTY_ORGANIZATION);
    }

    public void setOrganization(Organization organization) {
        set(PROPERTY_ORGANIZATION, organization);
    }

    public Boolean isActive() {
        return (Boolean) get(PROPERTY_ACTIVE);
    }

    public void setActive(Boolean active) {
        set(PROPERTY_ACTIVE, active);
    }

    public Date getCreationDate() {
        return (Date) get(PROPERTY_CREATIONDATE);
    }

    public void setCreationDate(Date creationDate) {
        set(PROPERTY_CREATIONDATE, creationDate);
    }

    public User getCreatedBy() {
        return (User) get(PROPERTY_CREATEDBY);
    }

    public void setCreatedBy(User createdBy) {
        set(PROPERTY_CREATEDBY, createdBy);
    }

    public Date getUpdated() {
        return (Date) get(PROPERTY_UPDATED);
    }

    public void setUpdated(Date updated) {
        set(PROPERTY_UPDATED, updated);
    }

    public User getUpdatedBy() {
        return (User) get(PROPERTY_UPDATEDBY);
    }

    public void setUpdatedBy(User updatedBy) {
        set(PROPERTY_UPDATEDBY, updatedBy);
    }

    public Attribute getAttribute() {
        return (Attribute) get(PROPERTY_ATTRIBUTE);
    }

    public void setAttribute(Attribute attribute) {
        set(PROPERTY_ATTRIBUTE, attribute);
    }

    public String getSearchKey() {
        return (String) get(PROPERTY_SEARCHKEY);
    }

    public void setSearchKey(String searchKey) {
        set(PROPERTY_SEARCHKEY, searchKey);
    }

    public String getName() {
        return (String) get(PROPERTY_NAME);
    }

    public void setName(String name) {
        set(PROPERTY_NAME, name);
    }

    public String getDescription() {
        return (String) get(PROPERTY_DESCRIPTION);
    }

    public void setDescription(String description) {
        set(PROPERTY_DESCRIPTION, description);
    }

    public String getDtpoItemno() {
        return (String) get(PROPERTY_DTPOITEMNO);
    }

    public void setDtpoItemno(String dtpoItemno) {
        set(PROPERTY_DTPOITEMNO, dtpoItemno);
    }

    public String getDtpoMake() {
        return (String) get(PROPERTY_DTPOMAKE);
    }

    public void setDtpoMake(String dtpoMake) {
        set(PROPERTY_DTPOMAKE, dtpoMake);
    }

    public String getDtpoModel() {
        return (String) get(PROPERTY_DTPOMODEL);
    }

    public void setDtpoModel(String dtpoModel) {
        set(PROPERTY_DTPOMODEL, dtpoModel);
    }

    public String getDtpoHsncode() {
        return (String) get(PROPERTY_DTPOHSNCODE);
    }

    public void setDtpoHsncode(String dtpoHsncode) {
        set(PROPERTY_DTPOHSNCODE, dtpoHsncode);
    }

    public String getDtpoCountryoforigin() {
        return (String) get(PROPERTY_DTPOCOUNTRYOFORIGIN);
    }

    public void setDtpoCountryoforigin(String dtpoCountryoforigin) {
        set(PROPERTY_DTPOCOUNTRYOFORIGIN, dtpoCountryoforigin);
    }

    public String getDtpoPortofloading() {
        return (String) get(PROPERTY_DTPOPORTOFLOADING);
    }

    public void setDtpoPortofloading(String dtpoPortofloading) {
        set(PROPERTY_DTPOPORTOFLOADING, dtpoPortofloading);
    }

    public String getDtpoUom() {
        return (String) get(PROPERTY_DTPOUOM);
    }

    public void setDtpoUom(String dtpoUom) {
        set(PROPERTY_DTPOUOM, dtpoUom);
    }

    public String getDtpoArea() {
        return (String) get(PROPERTY_DTPOAREA);
    }

    public void setDtpoArea(String dtpoArea) {
        set(PROPERTY_DTPOAREA, dtpoArea);
    }

    @SuppressWarnings("unchecked")
    public List<AttributeInstance> getAttributeInstanceList() {
      return (List<AttributeInstance>) get(PROPERTY_ATTRIBUTEINSTANCELIST);
    }

    public void setAttributeInstanceList(List<AttributeInstance> attributeInstanceList) {
        set(PROPERTY_ATTRIBUTEINSTANCELIST, attributeInstanceList);
    }

}