<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:output method="html" 
                indent="yes" 
                version="1.0" 
                doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
                doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" />

    <!-- Declare ROOT element to match against: /items -->
    <xsl:template match="/items">
    
            <!-- only process if we have some sold quantities! -->
            <xsl:if test="count(./item/qty[sold > 0]) != 0">
    
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Item Name</th>
                            <th>Price</th>
                            <th>Quantity Available</th>
                            <th>Quantity on Hold</th>
                            <th>Quantity Sold</th>
                        </tr>
                    </thead>
                    <tbody>
                    
                        <!-- for-each selected ./item in /items -->
                        <xsl:for-each select="./item">
                            <!-- who have a sold qty -->
                            <xsl:if test="./qty/sold > 0">
                                <tr>
                                    <th><xsl:value-of select="@id"/></th>
                                    <td><xsl:value-of select="./name"/></td>    
                                    <td><xsl:value-of select="./price"/></td>    
                                    <td><xsl:value-of select="./qty/total"/></td>    
                                    <td><xsl:value-of select="./qty/hold"/></td>    
                                    <td><xsl:value-of select="./qty/sold"/></td>    
                                </tr>
                            </xsl:if>
                        </xsl:for-each>
                        
                    </tbody>
                </table>
    
                <!-- the processing button -->
                <div class="container">
                    <a href="#"  class="btn btn-primary" onclick="processItems('process');">Process Items</a>
                </div>
    
            </xsl:if>
            
            <!-- otherwise... -->
            <xsl:if test="count(./item/qty[sold > 0]) = 0">
                <div class="alert alert-info"> No items have been sold, and therefore nothing needs to be processed right now.</div>
            </xsl:if>
                    
    </xsl:template>

</xsl:stylesheet>