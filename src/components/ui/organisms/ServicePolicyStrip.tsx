// src/components/ui/sections/ServicePolicyStrip.tsx
"use client";

import React from "react";

export default function ServicePolicyStrip({ className = "" }: { className?: string }) {
  return (
    <section className={`w-full bg-tertiary dark:bg-gray-400 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-6 text-xs sm:text-sm md:text-base text-black ">
        {/* 1 */}
        <div>
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAABOCAYAAACOqiAdAAAACXBIWXMAABCcAAAQnAEmzTo0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAR1SURBVHgB7ZzrbdswFIVPgQ7QDXI3aDYIN2g6gbRBsoHUCdIN3E4QdAJlg6QT2J0g2SDlhaVaNUTy8iGKMvQB94dhiyIPD5+iBWxsbGxsbGyk4QPKgHRc6/ik42ri+zcdf3Qc+njDwiwlnOrjBifBfHjp45eOJxQg5JywQK2OVx3vieNRR4ULQ+nokF6sqdjjKCBhxSjkE8wk4Krg/uo7lhFsSkDCClA4Zja2wK99OinS4mhRMPcIE2in4w7HEfbKkDa7mAeXLzoedDwH3IuvIRSGj2gsFhf+BnGQjhp+riyu6SrIBGvgP2eTwJXQYaXi2TI+l2Dn1JA5kCuRUAgK07V7jfw0WJnzxq7jfiyHy0zcwr1K4QFjyTz+Q+HUNEuA4G66D8gA145y/KZCWRDc4t1iZnhF0GF9EOzicZOercnS6EYK64MHqUWa7LjjX6PrGNdEXSExKsdNMjE2wHkkN0SX4yaZINinKcnmnYSM1s5Egwx93Q4ZrZ0JHkFNrks2wu5h71AJ64SdNVtLUnCv+XaIh2uYkAZpH6UwY5kauIWLtTZfy2tGdjYhjhbHPFXC33cwlykK29A9jgZhDKIN6cSI157lSSKezRhXiED6DDTEdeeixYjXGvLlEk/BXCaJ8JO4ligxrjOJFiJe68hX5ciH6brgaYmCn3BS17lE8xGvFaTTONIw5eURgdSAl3CSTEpFk4jXJsgPs7PcO4gG8gJKXOcrmk28VnCdRDTmAQUIx1FNpBUq2pR4reD3UtFc5TTyEWE8Wb5TOn6OPrNoHdwT0wPMzZL6NPhY1x3stDq+nV1Llt/bvgvCVBM+FpY6rYJsizvEaSoivSCayAR9RBsghIvXWPLSBaQXvHq4syTqmnaEiDZA8BevceRHeabn27L+o7YkauuvYkQbIMjFc4k20EEu2jsitsxsKwdboW8FmarghuAWTyoaoyAXjSN4AhyzHKkRJ9oAwSyej2gDHeTCuUZvK6ZMPwuurREn2gBN5CNENEZBLtwNIrDtkkrWpTXiRBsgnMQLFW3AZIaQ8hmpEW/lGmmORRAim09PjRkHhgHbQ43oxBfEtc+YooKsHarCOmlgF46QAIUZLb0Q2VqSzdoK68TkugoJsVl7j0JONXoy5bo9EmOzNkeWU40zcG6IpG4bcB2Rmv1U4wyMDZHcbWNsi/eijsB7MEzyZ3HbgILddVxrhHVBSHOMw4ltGVaieC1kT9+y0MEt3hJ/DBnDYvzAqRspYuQnyBbLLZaBkG5HJTkEmXgd8jbdFtNTp2Jcx3BzlIjHscO8Aiqk3TGeHYLfw5WUArKDeCejE967KNcxBP8nUzwnZAco+EE47qmxWL6v4kiyXcSkfGEL1yQLcY8wXmB+kw3h2C0Qwhxz0PG1v0ex1Ej3EoIUsfTfP70g2I/554g94v/3vxiE/AKyYBUuBMJRQC7UXIJ1OL5e42LhwqUSkcVqEHlCPISUo2oI1318xul1aOd/Fnnr49DH8Aq037jw159tbGxsbGxsbFj4C7XOZoyRzeTiAAAAAElFTkSuQmCC"
            className="w-12 m-auto mb-5 dark:text-white"
            alt="Easy Exchange"
          />
          <p className="font-semibold text-black dark:text-white">Easy Exchange Policy</p>
          <p className="text-black dark:text-white">We Offer hassle free exchange policy</p>
        </div>

        {/* 2 */}
        <div>
          <img
            src="/assets/11.png"
            className="w-12 m-auto mb-5"
            alt="3 Days Return"
          />
          <p className="font-semibold text-black dark:text-white">3 Days Return Policy</p>
          <p className="text-black dark:text-white">We provide 3 days free return policy</p>
        </div>

        {/* 3 */}
        <div>
          <img
            src="data:image/webp;base64,UklGRkACAABXRUJQVlA4WAoAAAAQAAAAQAAAQAAAQUxQSOYBAAABkJRtWxBdbwQaDBFsAA3mb6ANsAE2MAKngRG+CEb4IhDhW8yrAq7OLiImAM3dXyqnVjOrp+zzhMGnTexxLfM4Lok1rsUP4bZqPYvvF9V6F9/HHTagzj2i2l0t6ftxAD7hu8sds901W+1mzR88dN9yw9Q32uxaApr6ohemvslmlxrQ3JcLU99gs8vdoadXZuofbcY1oLPbmal7EI2rR//MTO55ZeoxYma23ipG1WPMzGy6sRhVj1EzkxvKAsYVYuvFYjRjYF9JdUyJYuiVWCaL0XksCFFyEsHgkVgE4I3Oo0HIASATxfCJVAecJI3n6o9FOKPTeChkRySKFy7kRCbHGzypOEh6A+qPfYSEV5zkq+QUEdnjKC4VEZFKZruv8wiu2P30wGzvN6k9zI+s9PLVutnax6kNUF2XzZqFEMKixFIXZeUbQij38OtOIj2i0YTf3ACR1B6JCNqBWI9M8v+pSiKJpPZIRJgwIacD4JRIj0hs/lmNJWI6x6RG5x6oxEr8K3bhKrmrvktmtzPWRwldnbbAvwc7Ok+1BfZbO7pP2gKLXugfBvTlQfoBwi5y7AGD+uUQKUnIzN6pJLzIG3UvOsiJQWN+vovRNMhmHf0Y3jpmjBk7nBjUtRM3CtZGNWHgKTecJ3BWUDggNAAAABAEAJ0BKkEAQQA+kUihTKWkIyIhSACwEglpAAAJ8aNGjRo0aNGjRn4AAP74zvFIAAAAAAA="
            className="w-12 m-auto mb-5"
            alt="Support"
          />
          <p className="font-semibold text-black dark:text-white">Best customer support</p>
          <p className="text-black dark:text-white">we provide 24/7 customer support</p>
        </div>
      </div>
    </section>
  );
}
