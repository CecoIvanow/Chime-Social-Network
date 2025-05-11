import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SectionHeading from "./SectionHeading";

describe('SectionHeading component', () => {
    it('Should render', () => {
        render(<SectionHeading />);

        expect(screen.getByRole('heading')).toBeInTheDocument();
    });

    it('Should render sectionName text', () => {
        

        render(<SectionHeading sectionName={'Friends'}/>);

        expect(screen.getByRole('heading')).toHaveTextContent('Friends');
    });
})