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

        <!-- for-each selected ./item in /items -->
        <xsl:for-each select="./item">
            
            <!-- given the item is avaliable -->
            <xsl:if test="./qty/total > 0">
            
                <!-- A new div with .well -->
                <div class="item well">    
                    
                    <!-- a new span with .label etc-->
                    <span class="label label-success pricetag">
                        <!-- give it this ./item's ./price-->
                        $<xsl:value-of select="./price"/>
                    </span>
                    
                    <!-- Insert thumbnail image if it exists -->
                    <div class="item-side">
                        <xsl:if test="./img">
                            <img src="{./img}" alt="{./name}" width="110" height="130" class="img-thumbnail" />
                        </xsl:if>
                        <!-- New button to add to shopping cart -->
                        <a onclick="shoppingCartRequest({@id}, 'add');" class="btn btn-info"> Add to Cart </a>
                    </div>
                    
                    <!-- A new h3, whose value is the value-of this ./item's ./name -->
                    <!-- and has a leading p of its item number -->
                    <div class="item-head">
                        <p class="lead">
                            <xsl:value-of select="@id"/>. 
                        </p>
                        <h3>
                            <xsl:value-of select="./name"/>
                        </h3>
                    </div>
                    
                    <div class="item-body">
                        <!-- A new p, whose value is the value-of this ./item's ./qty/total-->
                        <p><strong>Quantity: </strong><xsl:value-of select="./qty/total"/></p>
                    
                        <!-- A new p, whose value is the value-of this ./item's ./desc-->
                        <p><xsl:value-of select="./desc"/></p>                            
                    </div>
                </div>
                
            </xsl:if>
            
        </xsl:for-each>
    
</xsl:template>

</xsl:stylesheet>