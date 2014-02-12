<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" 
            indent="yes" 
            version="1.0" 
            doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
            doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" />

<!-- Declare ROOT element to match against: /cart -->
<xsl:template match="/cart">

        <div class="panel-heading">
            <a href="logout.html" class="btn btn-warning btn-xs pull-right"><span class="glyphicon glyphicon-log-out"></span> Logout</a>
            <h3 class="panel-title"><span class="glyphicon glyphicon-shopping-cart"></span> Shopping Cart</h3>
        </div>
        <div class="panel-body">

            <!-- For no items at all -->
            <xsl:if test="count(./item) &lt; 1">
                <p> No items in cart </p>
            </xsl:if>

            <!-- for-each selected ./item in /cart -->
            <xsl:for-each select="./item">
                <div class="list-group">
                    
                    <!-- A button to remove from cart -->
                    <a onclick="shoppingCartRequest({@id}, 'remove');" class="btn btn-xs btn-danger pull-right"> Remove </a>
                    
                    <div class="item-head">
                        <!-- A new p for row # -->
                        <p class="lead">
                            <xsl:value-of select="@id"/>. 
                        </p>
    
                        <!-- A new p for name -->
                        <p>    
                            <strong>
                                <!-- Insert this ./item's ./name -->
                                <xsl:value-of select="./name"/> 
                            </strong>
                        </p>
                        <!-- a badge for the qty -->
                        <span class="badge">
                             Qty: <xsl:value-of select="./qty"/>
                        </span>
                    </div>

                    <!-- A new p for price -->
                    <p class="price">$<xsl:value-of select="./price"/></p>
                    
                
                </div>
                
            </xsl:for-each>
            
        </div>
        <div class="panel-footer">
        
            <!-- total is the sum of all prices in the cart -->
            <h4>Total: $<span id="grand-total"><xsl:value-of select="sum(.//item/price)"/></span></h4>
            
            <div id="finalise-btns">
                <a href="#top" class="btn btn-sm btn-danger" onclick="shoppingCartRequest('', 'cancel');"> Cancel </a> 
                <a href="#top" class="btn btn-sm btn-primary" onclick="shoppingCartRequest('', 'confirm');"> Confirm </a>
            </div>
        </div>
    
</xsl:template>

</xsl:stylesheet>